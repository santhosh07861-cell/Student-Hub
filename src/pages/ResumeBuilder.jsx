import React from 'react';

export default function ResumeBuilder() {
  return (
    <div className="w-full h-[calc(100vh-var(--navbar-height))] overflow-hidden bg-white print:h-auto print:overflow-visible">
      <iframe
        src="https://uni-module-resume-builder.vercel.app/builder"
        className="w-full h-full border-none print:hidden"
        title="Resume Builder"
        allow="camera; microphone; clipboard-write; clipboard-read; payment"
      />
      {/* Print fallback in case the browser tries to print the parent container */}
      <div className="hidden print:block p-8 text-center text-slate-500">
        Please export your resume directly using the PDF download option inside the builder panel.
      </div>
    </div>
  );
}
