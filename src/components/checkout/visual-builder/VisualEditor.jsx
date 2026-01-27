import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Trash2, GripVertical, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import CheckoutElementRenderer from './CheckoutElementRenderer.jsx';

const deviceWidths = {
  desktop: 1200,
  tablet: 768,
  mobile: 375
};

export default function VisualEditor({ 
  config,
  elements, 
  selectedElement, 
  onSelectElement, 
  onUpdateElement,
  onDeleteElement,
  onReorderElements,
  device,
  zoom
}) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(elements);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onReorderElements(items);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const elementData = e.dataTransfer.getData('element');
    if (elementData) {
      // Element dropped from panel - handled by onAddElement in parent
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const canvasWidth = deviceWidths[device];
  const scaledWidth = (canvasWidth * zoom) / 100;

  return (
    <div 
      className="flex-1 bg-gray-100 overflow-auto p-6"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div 
        className="mx-auto transition-all duration-300"
        style={{ 
          width: scaledWidth,
          maxWidth: '100%',
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center'
        }}
      >
        {/* Checkout Canvas */}
        <div 
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          style={{ 
            backgroundColor: config.branding?.colors?.background || '#FFFFFF',
            fontFamily: config.branding?.typography?.font_family || 'Inter'
          }}
        >
          {/* Logo Area */}
          {config.branding?.logo_url && (
            <div className="p-4 flex justify-center border-b">
              <img 
                src={config.branding.logo_url} 
                alt="Logo" 
                className="max-h-12 object-contain"
              />
            </div>
          )}

          {/* Elements Area */}
          <div className="p-6">
            {elements.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <p className="text-gray-500 mb-2">Arraste elementos aqui</p>
                <p className="text-sm text-gray-400">
                  Ou clique em um elemento no painel esquerdo para adicioná-lo
                </p>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="checkout-elements">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={cn(
                        "space-y-4 min-h-[200px] rounded-lg transition-colors",
                        snapshot.isDraggingOver && "bg-[#00D26A]/5"
                      )}
                    >
                      {elements.map((element, index) => (
                        <Draggable 
                          key={element.id} 
                          draggableId={element.id} 
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={cn(
                                "relative group rounded-lg transition-all",
                                selectedElement?.id === element.id && "ring-2 ring-[#00D26A]",
                                snapshot.isDragging && "shadow-lg"
                              )}
                              onClick={() => onSelectElement(element)}
                            >
                              {/* Element Controls */}
                              <div className={cn(
                                "absolute -top-3 -right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10",
                                selectedElement?.id === element.id && "opacity-100"
                              )}>
                                <div
                                  {...provided.dragHandleProps}
                                  className="p-1 bg-white rounded shadow cursor-grab hover:bg-gray-50"
                                >
                                  <GripVertical className="w-4 h-4 text-gray-400" />
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 bg-white shadow hover:bg-gray-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectElement(element);
                                  }}
                                >
                                  <Settings className="w-3 h-3 text-gray-400" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 bg-white shadow hover:bg-red-50 hover:text-red-500"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteElement(element.id);
                                  }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>

                              {/* Element Renderer */}
                              <CheckoutElementRenderer 
                                element={element} 
                                config={config}
                                isSelected={selectedElement?.id === element.id}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>

          {/* Footer Area */}
          {config.layout?.footer?.security_badges && (
            <div className="p-4 border-t bg-gray-50 text-center">
              <p className="text-xs text-gray-500">
                {config.layout?.footer?.security_text || 'Pagamento 100% seguro'}
              </p>
              {config.layout?.footer?.card_brands && (
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">Visa</div>
                  <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">MC</div>
                  <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">Elo</div>
                  <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">Pix</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}