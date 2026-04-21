import Table from '../ui/Table';
import { textStrings } from '../../../constants/textStrings';

const fmt = (iso) => {
  const d = iso ? new Date(iso) : null;
  if (!d || Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 16).replace('T', ' ');
};

const ActivityLogTable = ({ items }) => {
  const safeItems = Array.isArray(items) ? items : [];
  const columns = [
    { key: 'timestamp', header: textStrings.admin.profile.activity.columns.time, render: (i) => <span className="uiHelpText">{fmt(i.timestamp)}</span> },
    { key: 'action_type', header: textStrings.admin.profile.activity.columns.action, render: (i) => <strong>{i.action_type}</strong> },
    { key: 'target_entity', header: textStrings.admin.profile.activity.columns.target, render: (i) => i.target_entity || '-' },
    { key: 'description', header: textStrings.admin.profile.activity.columns.description, render: (i) => i.description || '-' },
  ];

  if (safeItems.length === 0) {
    return <Table columns={columns} data={safeItems} emptyLabel={textStrings.admin.profile.activity.empty} />;
  }

  return (
    <>
      <div className="adminActivityTable">
        <Table columns={columns} data={safeItems} emptyLabel={textStrings.admin.profile.activity.empty} />
      </div>

      <div className="adminActivityMobileList">
        {safeItems.map((item, index) => (
          <div key={`${item.timestamp || 'activity'}-${item.action_type || 'item'}-${index}`} className="adminActivityMobileCard">
            <div className="adminActivityMobileCard__row">
              <span className="adminActivityMobileCard__label">{textStrings.admin.profile.activity.columns.time}</span>
              <span className="uiHelpText">{fmt(item.timestamp) || '-'}</span>
            </div>
            <div className="adminActivityMobileCard__row">
              <span className="adminActivityMobileCard__label">{textStrings.admin.profile.activity.columns.action}</span>
              <strong>{item.action_type || '-'}</strong>
            </div>
            <div className="adminActivityMobileCard__row">
              <span className="adminActivityMobileCard__label">{textStrings.admin.profile.activity.columns.target}</span>
              <span>{item.target_entity || '-'}</span>
            </div>
            <div className="adminActivityMobileCard__row">
              <span className="adminActivityMobileCard__label">{textStrings.admin.profile.activity.columns.description}</span>
              <span>{item.description || '-'}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ActivityLogTable;
