import { useParams } from 'react-router-dom'

export default function AssessmentHubPage() {
  const { subjectId } = useParams()
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-page-title text-text-dark">Assessment Hub</h1>
        <p className="text-text-muted mt-1">Subject: {subjectId || 'Select a subject'}</p>
      </div>
      <div className="bg-card rounded-card p-6 shadow-sm border border-border">
        <p className="text-text-muted">Assessment hub coming soon...</p>
      </div>
    </div>
  )
}
