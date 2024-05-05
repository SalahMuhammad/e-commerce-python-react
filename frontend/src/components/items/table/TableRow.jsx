
export default function TableRow({ item, selectedId, setSelectedId, children }) {
	const className = item.id === selectedId ? 'active' : ''

	function handleRowClick() {
		setSelectedId(item.id)
	}

	return (
		<tr className={className} onClick={handleRowClick}>
			<td>
				<button className="btn btn-secondary">
					تعديل
				</button>
				<button className="btn btn-danger">
					حذف
				</button>
			</td>
			<td><span>{item.name}</span></td>
			<td className="prices">
				<span>{item.price1} </span>
				<span>{item.price2} </span>
				<span>{item.price3} </span>
				<span>{item.price4} </span>
			</td>
			{children}
		</tr>
	)
}
