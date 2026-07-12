import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass, AlertOctagon } from 'lucide-react';
import Button from '../../components/common/Button';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center select-none font-sans">
      <div className="relative mb-6">
        {/* Animated radar rings representing lost coordinates */}
        <div className="absolute inset-0 bg-brand-100 rounded-full scale-150 opacity-20 animate-pulse" />
        <div className="absolute inset-0 bg-brand-200 rounded-full scale-200 opacity-10 animate-ping [animation-duration:3s]" />
        
        <div className="relative w-20 h-20 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center shadow-sm">
          <Compass className="w-10 h-10 text-brand-600 animate-[spin_12s_linear_infinite]" />
        </div>
      </div>

      <h1 className="text-4xl font-extrabold text-slate-800 font-display tracking-tight">
        404
      </h1>
      <h2 className="text-base font-bold text-slate-700 mt-2">
        Ledger Destination Not Found
      </h2>
      <p className="text-xs text-slate-400 mt-2 max-w-sm leading-relaxed mx-auto">
        The coordinate node or transit ledger path you tried to access does not exist on the TransitOps network.
      </p>

      <div className="mt-8">
        <Button
          variant="primary"
          onClick={() => navigate('/dashboard')}
          icon={<ArrowLeft className="w-4 h-4" />}
          isMagnetic={true}
          className="font-semibold text-xs py-2.5 px-5"
        >
          Return to Cockpit
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
