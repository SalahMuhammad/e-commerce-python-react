
export default function TableHead({ headers }) {
  
  return (
    <thead>
      <tr>
        {headers.map((header) => (
          <td key={header}>
            {header}
          </td>
        ))}
      </tr>
    </thead>
  )
}
