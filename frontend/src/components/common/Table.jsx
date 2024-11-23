
export default function Table({ theadList, caption='', captionStyle='caption-top', children }) {
    return (
        <div className="table-responsive my-table">
            <table className={`table table-striped table-hover table-borderless align-middle ${captionStyle}`}>
                <caption>{caption}</caption>
                <thead className="table-light">
                    <tr>
                        {theadList.map((value) => {
                            return (
                                <th key={value} scope="col">{value}</th>
                            );
                        })}
                    </tr>
                </thead>
                {children}
            </table>
        </div>
    )
}