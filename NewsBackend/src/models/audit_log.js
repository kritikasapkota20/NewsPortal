import mongoose from 'mongoose'

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // create, update, delete, submit, approve, reject, unpublish
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  role: { type: String },
  details: { type: Object },
  createdAt: { type: Date, default: Date.now },
})

const AuditLog = mongoose.model('AuditLog', auditLogSchema)
export default AuditLog


