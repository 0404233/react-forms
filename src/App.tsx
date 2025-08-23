import { useState } from 'react';
import Modal from './components/Modal';
import HookForm from './forms/HookForm';
import UncontrolledForm from './forms/UncontrolledForm';
import Tiles from './components/Tiles';
import { useSubmissions } from './hooks';

export default function App() {
  const [which, setWhich] = useState<
    'none' | 'uncontrolled' | 'react-hook-form'
  >('none');
  const { items, lastNewId } = useSubmissions();

  return (
    <div className="container">
      <header>
        <h1>React Forms</h1>
      </header>

      <div className="actions">
        <button onClick={() => setWhich('uncontrolled')}>
          Open Uncontrolled Form
        </button>
        <button onClick={() => setWhich('react-hook-form')}>
          Open React Hook Form
        </button>
      </div>

      <Tiles items={items} highlightId={lastNewId} />

      <Modal
        isOpen={which !== 'none'}
        onClose={() => setWhich('none')}
        title={
          which === 'react-hook-form' ? 'React Hook Form' : 'Uncontrolled Form'
        }
      >
        {which === 'react-hook-form' ? (
          <HookForm onSuccess={() => setWhich('none')} />
        ) : which === 'uncontrolled' ? (
          <UncontrolledForm onSuccess={() => setWhich('none')} />
        ) : null}
      </Modal>
    </div>
  );
}
