import { useEffect, useMemo, useReducer, useState } from 'react';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../../services/api';
import { useNotifications } from '../context/NotificationsContext';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import Table from '../components/ui/Table';

const initial = {
  loading: true,
  error: null,
  products: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_SUCCESS':
      return { loading: false, error: null, products: action.products };
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.error || 'Failed to load data' };
    case 'UPSERT':
      return {
        ...state,
        products: state.products.some((p) => p.id === action.product.id)
          ? state.products.map((p) => (p.id === action.product.id ? action.product : p))
          : [action.product, ...state.products],
      };
    case 'REMOVE':
      return { ...state, products: state.products.filter((p) => p.id !== action.id) };
    default:
      return state;
  }
}

const ProductForm = ({ open, onClose, initialValue, onSave }) => {
  const [name, setName] = useState(initialValue?.name || '');
  const [price, setPrice] = useState(initialValue?.price ?? '');
  const [size, setSize] = useState(initialValue?.size || '');
  const [color, setColor] = useState(initialValue?.color || '');
  const [stock, setStock] = useState(initialValue?.stock ?? '');
  const [category, setCategory] = useState(initialValue?.category || '');
  const [image, setImage] = useState(initialValue?.image || '');
  const [preview, setPreview] = useState(initialValue?.image || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setName(initialValue?.name || '');
    setPrice(initialValue?.price ?? '');
    setSize(initialValue?.size || '');
    setColor(initialValue?.color || '');
    setStock(initialValue?.stock ?? '');
    setCategory(initialValue?.category || '');
    setImage(initialValue?.image || '');
    setPreview(initialValue?.image || '');
    setError('');
  }, [open, initialValue]);

  const submit = async () => {
    setSaving(true);
    setError('');
    try {
      await onSave({
        name,
        price,
        size,
        color,
        stock,
        category,
        image,
      });
      onClose();
    } catch (e) {
      setError(e?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={initialValue ? 'Edit product' : 'New product'}
      open={open}
      onClose={saving ? undefined : onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </>
      }
    >
      <div className="adminGrid adminGrid--2">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Navy Wool Suit" />
        <Input
          label="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="249"
          inputMode="decimal"
        />
        <Input label="Size" value={size} onChange={(e) => setSize(e.target.value)} placeholder="S / M / L" />
        <Input label="Color" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Navy" />
        <Input
          label="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="12"
          inputMode="numeric"
        />
        <Input label="Category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Suits" />
      </div>

      <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
        <Input
          label="Image"
          helpText="Upload an image (preview stays local in mock mode)."
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const url = URL.createObjectURL(file);
            setImage(url);
            setPreview(url);
          }}
        />
        {preview ? (
          <div
            style={{
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 16,
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <img src={preview} alt="Preview" style={{ width: '100%', display: 'block', maxHeight: 220, objectFit: 'cover' }} />
          </div>
        ) : null}
        {error ? <div className="uiErrorText">{error}</div> : null}
      </div>
    </Modal>
  );
};

const Products = () => {
  const [state, dispatch] = useReducer(reducer, initial);
  const notifications = useNotifications();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState('');

  const load = async () => {
    dispatch({ type: 'LOAD_START' });
    try {
      const products = await getProducts();
      dispatch({ type: 'LOAD_SUCCESS', products });
    } catch (e) {
      dispatch({ type: 'LOAD_ERROR', error: e?.message || 'Failed to load data' });
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = useMemo(
    () => [
      { key: 'name', header: 'Product', render: (p) => <strong>{p.name}</strong> },
      { key: 'category', header: 'Category' },
      { key: 'price', header: 'Price', render: (p) => `$${p.price}` },
      { key: 'stock', header: 'Stock', render: (p) => (p.stock <= 3 ? <Badge tone="warn">Low ({p.stock})</Badge> : p.stock) },
      { key: 'color', header: 'Color' },
      {
        key: 'actions',
        header: 'Actions',
        render: (p) => (
          <div style={{ display: 'flex', gap: 10 }}>
            <Button
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                setEditing(p);
                setModalOpen(true);
              }}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              disabled={deletingId === p.id}
              onClick={async (e) => {
                e.stopPropagation();
                setDeletingId(p.id);
                try {
                  await deleteProduct(p.id);
                  dispatch({ type: 'REMOVE', id: p.id });
                  notifications.addNotification({ type: 'info', message: `Product deleted: ${p.name}.` });
                } catch {
                  // ignore (mock)
                } finally {
                  setDeletingId('');
                }
              }}
            >
              {deletingId === p.id ? 'Deleting…' : 'Delete'}
            </Button>
          </div>
        ),
      },
    ],
    [deletingId]
  );

  return (
    <Card
      title="Products"
      action={
        <Button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          New product
        </Button>
      }
    >
      {state.loading ? (
        <Spinner label="Loading products" />
      ) : state.error ? (
        <div style={{ display: 'grid', gap: 12 }}>
          <div className="uiErrorText">{state.error}</div>
          <Button variant="secondary" onClick={load}>
            Retry
          </Button>
        </div>
      ) : (
        <Table
          columns={columns}
          data={state.products}
          rowAction={(row) => {
            setEditing(row);
            setModalOpen(true);
          }}
        />
      )}

      <ProductForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialValue={editing}
        onSave={async (payload) => {
          const result = editing ? await updateProduct(editing.id, payload) : await createProduct(payload);
          dispatch({ type: 'UPSERT', product: result });
          notifications.addNotification({
            type: result.stock <= 3 ? 'warn' : 'info',
            message: `${editing ? 'Product updated' : 'Product created'}: ${result.name}.`,
          });
        }}
      />
    </Card>
  );
};

export default Products;
