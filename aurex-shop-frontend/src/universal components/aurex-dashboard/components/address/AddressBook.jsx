import { useMemo, useState } from 'react';
import Button from '../../Button';
import InputField from '../../InputField';

const AddressBook = ({ addresses = [], onAdd, onRemove, onSetDefault, limit }) => {
  const list = useMemo(() => (limit ? addresses.slice(0, limit) : addresses), [addresses, limit]);
  const [label, setLabel] = useState('');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  return (
    <section className="mdCard">
      <div className="mdSectionHeader">
        <div>
          <div className="mdSectionTitle">Address book</div>
          <div className="mdMuted">Saved delivery addresses for repeat buys.</div>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="mdMuted">No saved addresses yet.</div>
      ) : (
        <div className="mdAddressList">
          {list.map((a) => (
            <div key={a.id} className="mdAddressCard">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
                <div style={{ fontWeight: 900 }}>
                  {a.label} {a.isDefault ? <span className="mdMuted">(Default)</span> : null}
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {!a.isDefault ? (
                    <Button variant="outline" onClick={() => onSetDefault(a.id)}>
                      Set default
                    </Button>
                  ) : null}
                  <Button variant="outline" onClick={() => onRemove(a.id)}>
                    Remove
                  </Button>
                </div>
              </div>
              <div className="mdMuted">{a.line1}</div>
              <div className="mdMuted">
                {a.city}, {a.country}
              </div>
            </div>
          ))}
        </div>
      )}

      {!limit ? (
        <div className="mdDivider">
          <div className="mdSectionTitle" style={{ fontSize: 14 }}>
            Add address
          </div>
          <div className="mdFormGrid mdFormGrid--2">
            <div>
              <div className="mdFormLabel">Label</div>
              <InputField value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Home / Office" />
            </div>
            <div>
              <div className="mdFormLabel">Address line</div>
              <InputField value={line1} onChange={(e) => setLine1(e.target.value)} placeholder="Street, building, etc." />
            </div>
            <div>
              <div className="mdFormLabel">City</div>
              <InputField value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
            </div>
            <div>
              <div className="mdFormLabel">Country</div>
              <InputField value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" />
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <Button
              onClick={() => {
                onAdd({
                  label: label.trim() || 'Address',
                  line1: line1.trim(),
                  city: city.trim(),
                  country: country.trim(),
                });
                setLabel('');
                setLine1('');
                setCity('');
                setCountry('');
              }}
              disabled={!line1.trim() || !city.trim() || !country.trim()}
            >
              Save address
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default AddressBook;

