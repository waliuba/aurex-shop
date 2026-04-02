import Text from '../../../universal components/textstring';
import colorstring from '../../../universal components/colorstrings';

const Table = ({ columns, data, keyField = 'id', emptyLabel = Text.admin.common.noResults, rowAction }) => {
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
              <td colSpan={columns.length} style={{ color: colorstring.admin.mutedStrong }}>
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
