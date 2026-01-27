import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function BasicInfoSection({ formData, setFormData }) {
  const handleImageUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      if (field === 'main_image_url') {
        setFormData({ ...formData, main_image_url: file_url });
      } else {
        const gallery = formData.gallery_image_urls || [];
        if (gallery.length < 5) {
          setFormData({ ...formData, gallery_image_urls: [...gallery, file_url] });
        } else {
          toast.error('Máximo de 5 imagens na galeria');
        }
      }
    } catch (err) {
      toast.error('Erro ao fazer upload da imagem');
    }
  };

  const removeGalleryImage = (index) => {
    const gallery = [...(formData.gallery_image_urls || [])];
    gallery.splice(index, 1);
    setFormData({ ...formData, gallery_image_urls: gallery });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium">Título/Nome do Link *</Label>
        <Input
          placeholder="Ex: Curso de Marketing Digital"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          maxLength={100}
          className="mt-1.5"
        />
        <p className="text-xs text-gray-500 mt-1">{(formData.name || '').length}/100 caracteres</p>
      </div>

      <div>
        <Label className="text-sm font-medium">Descrição</Label>
        <Textarea
          placeholder="Descrição do produto ou serviço (visível na página de pagamento)"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          maxLength={500}
          className="mt-1.5 h-24"
        />
        <p className="text-xs text-gray-500 mt-1">{(formData.description || '').length}/500 caracteres</p>
      </div>

      <div>
        <Label className="text-sm font-medium">Descrição Longa</Label>
        <Textarea
          placeholder="Texto detalhado com benefícios, termos, etc. (Markdown suportado)"
          value={formData.long_description || ''}
          onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
          maxLength={5000}
          className="mt-1.5 h-40"
        />
        <p className="text-xs text-gray-500 mt-1">{(formData.long_description || '').length}/5000 caracteres</p>
      </div>

      <div>
        <Label className="text-sm font-medium">Imagem Principal</Label>
        <div className="mt-1.5">
          {formData.main_image_url ? (
            <div className="relative w-40 h-32 rounded-lg overflow-hidden border">
              <img 
                src={formData.main_image_url} 
                alt="Preview" 
                className="w-full h-full object-cover" 
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={() => setFormData({ ...formData, main_image_url: '' })}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-40 h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-500 mt-1">Upload</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, 'main_image_url')}
              />
            </label>
          )}
          <p className="text-xs text-gray-500 mt-1">JPG, PNG ou WebP. Máx 5MB. Recomendado: 800x600px</p>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Galeria de Imagens (até 5)</Label>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {(formData.gallery_image_urls || []).map((url, index) => (
            <div key={index} className="relative w-24 h-20 rounded-lg overflow-hidden border">
              <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-0.5 right-0.5 h-5 w-5"
                onClick={() => removeGalleryImage(index)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
          {(formData.gallery_image_urls || []).length < 5 && (
            <label className="flex flex-col items-center justify-center w-24 h-20 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
              <ImageIcon className="w-5 h-5 text-gray-400" />
              <span className="text-xs text-gray-500">+</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, 'gallery')}
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}