import { useEffect } from 'react'
import { useAppDispatch } from '../hooks'
import { clearHighlight } from '../store/submissionsSlice'

export default function Tiles({ items, highlightId }: { items: any[], highlightId?: string }) {
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (!highlightId) return
    const t = setTimeout(() => dispatch(clearHighlight()), 3000)
    return () => clearTimeout(t)
  }, [highlightId, dispatch])

  return (
    <div className="tiles">
      {items.map(item => (
        <div key={item.id} className={`tile ${highlightId === item.id ? 'new' : ''}`}>
          <div className="row between">
            <strong>{item.name}</strong>
            <span className="badge">{item.source}</span>
          </div>
          <div className="grid">
            <div><label>Age</label><div>{item.age}</div></div>
            <div><label>Email</label><div>{item.email}</div></div>
            <div><label>Gender</label><div>{item.gender}</div></div>
            <div><label>Country</label><div>{item.country}</div></div>
            <div><label>Accepted T&C</label><div>{item.acceptedTC ? 'Yes' : 'No'}</div></div>
          </div>
          {item.pictureBase64 && (
            <div className="picture"><img alt={`${item.name} avatar`} src={item.pictureBase64} /></div>
          )}
        </div>
      ))}
    </div>
  )
}