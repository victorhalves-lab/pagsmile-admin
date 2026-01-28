import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, Download, XCircle, CheckCircle } from 'lucide-react';

export default function DocumentViewer({ docUrl, docName, onApprove, onReject }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Eye className="w-4 h-4" /> Visualizar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{docName}</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" /> Baixar
            </Button>
            {onApprove && (
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onApprove}>
                <CheckCircle className="w-4 h-4 mr-2" /> Aprovar
              </Button>
            )}
            {onReject && (
              <Button size="sm" variant="destructive" onClick={onReject}>
                <XCircle className="w-4 h-4 mr-2" /> Rejeitar
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center border">
          {docUrl?.endsWith('.pdf') ? (
            <iframe src={docUrl} className="w-full h-full" title={docName} />
          ) : (
            <img src={docUrl} alt={docName} className="max-w-full max-h-full object-contain" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}