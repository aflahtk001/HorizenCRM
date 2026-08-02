export interface CallRecord {
  _id: string;
  shopName: string;
  shopNumber: string;
  callStatus: 'Answered' | 'Rejected' | 'Busy' | 'No Answer' | 'Switched Off' | 'Call Back Later';
  websiteDiscussed: 'Yes' | 'No';
  followUpDate?: string;
  followUpTime?: string;
  remarks?: string;
  addedBy: string;
  createdAt: string;
  updatedAt: string;
}

const DATA_API_URL = process.env.MONGODB_DATA_API_URL;
const DATA_API_KEY = process.env.MONGODB_DATA_API_KEY;
const DATABASE_NAME = process.env.MONGODB_DATABASE || 'horizen-crm';
const COLLECTION_NAME = process.env.MONGODB_COLLECTION || 'calls';
const DATA_SOURCE = process.env.MONGODB_DATA_SOURCE || 'Cluster0';

const isDataApiConfigured = Boolean(DATA_API_URL && DATA_API_KEY);

async function getMongooseCall() {
  const connectToDatabase = (await import('./mongodb')).default;
  const Call = (await import('./models/Call')).default;
  await connectToDatabase();
  return Call;
}

async function dataApiFetch(action: string, body: Record<string, unknown>) {
  if (!DATA_API_URL || !DATA_API_KEY) {
    throw new Error('Data API configuration missing');
  }

  const res = await fetch(`${DATA_API_URL.replace(/\/+$/, '')}/action/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': DATA_API_KEY,
    },
    body: JSON.stringify({
      dataSource: DATA_SOURCE,
      database: DATABASE_NAME,
      collection: COLLECTION_NAME,
      ...body,
    }),
    cache: 'no-store',
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Data API error (${res.status}): ${errText}`);
  }

  return res.json();
}

function normalizeDoc(doc: any): CallRecord {
  if (!doc) return doc;
  const id = doc._id?.$oid ? doc._id.$oid : String(doc._id);
  const createdAt = doc.createdAt?.$date ? new Date(doc.createdAt.$date).toISOString() : (doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString());
  const updatedAt = doc.updatedAt?.$date ? new Date(doc.updatedAt.$date).toISOString() : (doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString());

  return {
    _id: id,
    shopName: doc.shopName || '',
    shopNumber: doc.shopNumber || '',
    callStatus: doc.callStatus || 'Answered',
    websiteDiscussed: doc.websiteDiscussed || 'No',
    followUpDate: doc.followUpDate || undefined,
    followUpTime: doc.followUpTime || undefined,
    remarks: doc.remarks || '',
    addedBy: doc.addedBy || 'Aflah',
    createdAt,
    updatedAt,
  };
}

export async function fetchCalls(filterQuery: Record<string, unknown> = {}): Promise<CallRecord[]> {
  if (isDataApiConfigured) {
    const res = await dataApiFetch('find', {
      filter: filterQuery,
      sort: { createdAt: -1 },
    });
    return (res.documents || []).map(normalizeDoc);
  } else {
    const Call = await getMongooseCall();
    const docs = await Call.find(filterQuery).sort({ createdAt: -1 }).lean();
    return docs.map(normalizeDoc);
  }
}

export async function fetchCallById(id: string): Promise<CallRecord | null> {
  if (isDataApiConfigured) {
    const res = await dataApiFetch('findOne', {
      filter: {
        $or: [{ _id: { $oid: id } }, { _id: id }],
      },
    });
    return res.document ? normalizeDoc(res.document) : null;
  } else {
    const Call = await getMongooseCall();
    const doc = await Call.findById(id).lean();
    return doc ? normalizeDoc(doc) : null;
  }
}

export async function createCallRecord(data: Omit<CallRecord, '_id' | 'createdAt' | 'updatedAt'>): Promise<CallRecord> {
  const now = new Date();
  if (isDataApiConfigured) {
    const docToInsert = {
      ...data,
      createdAt: { $date: now.toISOString() },
      updatedAt: { $date: now.toISOString() },
    };
    const res = await dataApiFetch('insertOne', { document: docToInsert });
    return normalizeDoc({
      _id: res.insertedId,
      ...data,
      createdAt: now,
      updatedAt: now,
    });
  } else {
    const Call = await getMongooseCall();
    const doc = await Call.create(data);
    return normalizeDoc(doc.toObject());
  }
}

export async function updateCallRecord(id: string, data: Partial<Omit<CallRecord, '_id' | 'createdAt' | 'updatedAt'>>): Promise<CallRecord | null> {
  const now = new Date();
  if (isDataApiConfigured) {
    const updateFields = {
      ...data,
      updatedAt: { $date: now.toISOString() },
    };
    await dataApiFetch('updateOne', {
      filter: {
        $or: [{ _id: { $oid: id } }, { _id: id }],
      },
      update: { $set: updateFields },
    });
    return fetchCallById(id);
  } else {
    const Call = await getMongooseCall();
    const doc = await Call.findByIdAndUpdate(
      id,
      { ...data, updatedAt: now },
      { new: true, runValidators: true }
    ).lean();
    return doc ? normalizeDoc(doc) : null;
  }
}

export async function deleteCallRecord(id: string): Promise<boolean> {
  if (isDataApiConfigured) {
    const res = await dataApiFetch('deleteOne', {
      filter: {
        $or: [{ _id: { $oid: id } }, { _id: id }],
      },
    });
    return res.deletedCount > 0;
  } else {
    const Call = await getMongooseCall();
    const res = await Call.findByIdAndDelete(id);
    return Boolean(res);
  }
}

export async function fetchStatsData() {
  const calls = await fetchCalls();
  const total = calls.length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayDate = new Date();
  const startOfWeek = new Date(todayDate);
  startOfWeek.setDate(todayDate.getDate() - todayDate.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const startOfMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
  const endOfMonth = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0, 23, 59, 59, 999);

  let answered = 0;
  let rejected = 0;
  let busy = 0;
  let websiteDiscussed = 0;
  let followUpsToday = 0;
  let upcomingFollowUps = 0;
  let overdueFollowUps = 0;
  let callsByAflah = 0;
  let callsByAnna = 0;
  let callsThisWeek = 0;
  let callsThisMonth = 0;

  for (const c of calls) {
    if (c.callStatus === 'Answered') answered++;
    if (c.callStatus === 'Rejected') rejected++;
    if (c.callStatus === 'Busy' || c.callStatus === 'No Answer' || c.callStatus === 'Switched Off') busy++;
    if (c.websiteDiscussed === 'Yes') websiteDiscussed++;

    if (c.addedBy === 'Aflah') callsByAflah++;
    if (c.addedBy === 'Anna') callsByAnna++;

    if (c.followUpDate) {
      if (c.followUpDate === todayStr) followUpsToday++;
      else if (c.followUpDate > todayStr) upcomingFollowUps++;
      else if (c.followUpDate < todayStr) overdueFollowUps++;
    }

    const createdTime = new Date(c.createdAt).getTime();
    if (createdTime >= startOfWeek.getTime() && createdTime <= endOfWeek.getTime()) {
      callsThisWeek++;
    }
    if (createdTime >= startOfMonth.getTime() && createdTime <= endOfMonth.getTime()) {
      callsThisMonth++;
    }
  }

  return {
    total,
    answered,
    rejected,
    busy,
    websiteDiscussed,
    followUpsToday,
    upcomingFollowUps,
    overdueFollowUps,
    callsByAflah,
    callsByAnna,
    callsThisWeek,
    callsThisMonth,
  };
}
