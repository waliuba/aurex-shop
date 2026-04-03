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
import sizes from '../../universal components/sizes';
import Text from '../../universal components/textstring';
import colorstring from '../../universal components/colorstrings';

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
      return { ...state, loading: false, error: action.error || Text.admin.common.failedToLoad };
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
      setError(e?.message || Text.admin.products.form.errors.failedToSave);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={initialValue ? Text.admin.products.form.editTitle : Text.admin.products.form.newTitle}
      open={open}
      onClose={saving ? undefined : onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            {Text.admin.actions.cancel}
          </Button>
          <Button onClick={submit} disabled={saving}>
            {saving ? Text.admin.common.saving : Text.admin.actions.save}
          </Button>
        </>
      }
    >
      <div className="adminGrid adminGrid--2">
        <Input
          label={Text.admin.products.form.fields.name.label}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={Text.admin.products.form.fields.name.placeholder}
        />
        <Input
          label={Text.admin.products.form.fields.price.label}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder={Text.admin.products.form.fields.price.placeholder}
          inputMode="decimal"
        />
        <Input
          label={Text.admin.products.form.fields.size.label}
          value={size}
          onChange={(e) => setSize(e.target.value)}
          placeholder={Text.admin.products.form.fields.size.placeholder}
        />
        <Input
          label={Text.admin.products.form.fields.color.label}
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder={Text.admin.products.form.fields.color.placeholder}
        />
        <Input
          label={Text.admin.products.form.fields.stock.label}
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder={Text.admin.products.form.fields.stock.placeholder}
          inputMode="numeric"
        />
        <Input
          label={Text.admin.products.form.fields.category.label}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder={Text.admin.products.form.fields.category.placeholder}
        />
      </div>

      <div style={{ marginTop: sizes.admin.products.formMediaMarginTop, display: 'grid', gap: sizes.admin.products.formMediaGap }}>
        <Input
          label={Text.admin.products.form.fields.image.label}
          helpText={Text.admin.products.form.fields.image.helpText}
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
              border: `1px solid ${colorstring.admin.border}`,
              borderRadius: sizes.admin.products.previewRadius,
              overflow: 'hidden',
              background: colorstring.admin.panelSoft,
            }}
          >
            <img
              src={preview}
              alt={Text.admin.products.form.fields.image.previewAlt}
              style={{
                width: '100%',
                display: 'block',
                maxHeight: sizes.admin.products.previewMaxHeight,
                objectFit: 'cover',
              }}
            />
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
      dispatch({ type: 'LOAD_ERROR', error: e?.message || Text.admin.common.failedToLoad });
    }
  };

  useEffect(() => {
    load();
   
  }, []);

  const columns = useMemo(
    () => [
      { key: 'name', header: Text.admin.products.columns.product, render: (p) => <strong>{p.name}</strong> },
      { key: 'category', header: Text.admin.products.columns.category },
      { key: 'price', header: Text.admin.products.columns.price, render: (p) => `$${p.price}` },
      {
        key: 'stock',
        header: Text.admin.products.columns.stock,
        render: (p) => (p.stock <= 3 ? <Badge tone="warn">{Text.admin.products.stock.low(p.stock)}</Badge> : p.stock),
      },
      { key: 'color', header: Text.admin.products.columns.color },
      {
        key: 'actions',
        header: Text.admin.products.columns.actions,
        render: (p) => (
          <div style={{ display: 'flex', gap: sizes.admin.products.actionsGap }}>
            <Button
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                setEditing(p);
                setModalOpen(true);
              }}
            >
              {Text.admin.actions.edit}
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
                  notifications.addNotification({ type: 'info', message: Text.admin.products.notifications.deleted(p.name) });
                } catch {
                  // ignore (mock)
                } finally {
                  setDeletingId('');
                }
              }}
            >
              {deletingId === p.id ? Text.admin.common.deleting : Text.admin.actions.delete}
            </Button>
          </div>
        ),
      },
    ],
    [deletingId, notifications]
  );

  return (
    <Card
      title={Text.admin.products.title}
      action={
        <Button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          {Text.admin.products.newProduct}
        </Button>
      }
    >
      {state.loading ? (
        <Spinner label={Text.admin.products.loading} />
      ) : state.error ? (
        <div style={{ display: 'grid', gap: sizes.admin.gaps.lg }}>
          <div className="uiErrorText">{state.error}</div>
          <Button variant="secondary" onClick={load}>
            {Text.admin.actions.retry}
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
          const mode = editing ? 'Product updated' : 'Product created';
          notifications.addNotification({
            type: result.stock <= 3 ? 'warn' : 'info',
            message: Text.admin.products.notifications.saved(mode, result.name),
          });
        }}
      />
    </Card>
  );
};

export default Products;
