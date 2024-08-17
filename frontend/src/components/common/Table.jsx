
export default function Table({ theadList, caption='', children }) {
    return (
        <div className="table-responsive my-table">
            <table className="table table-striped table-hover table-borderless align-middle caption-top">
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