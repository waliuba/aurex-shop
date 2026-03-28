const Table = ({ columns, data, keyField = 'id', emptyLabel = 'No results', rowAction }) => {
  return (
    <div className="uiTableWrap">
      <table className="uiTable">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ color: 'rgba(255,255,255,0.65)' }}>
                {emptyLabel}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row[keyField]}
                onClick={rowAction ? () => rowAction(row) : undefined}
                style={rowAction ? { cursor: 'pointer' } : undefined}
              >
                {columns.map((col) => (
                  <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

