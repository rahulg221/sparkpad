import { NoteService } from '../../api/noteService';
import { useAuth } from '../../context/AuthProvider';
import { ScrollView, Row } from '../../styles/shared/BaseLayout';
import { Container } from '../../styles/shared/BaseLayout';
import { LoadingSpinner } from '../../styles/shared/LoadingSpinner';
import { useState, useEffect } from 'react';
import Tree, { TreeNodeDatum } from 'react-d3-tree';
import { TreeContainer, TreeNodeBox, TreeNodeContent } from './Tree.Styles';
import { CustomDropdown } from '../dropdown/Dropdown';
import { useActions } from '../../context/ActionsContext';
import { UpdateNoteModal } from '../modal/UpdateNoteModal';

type TreeViewProps = {
  showTree: boolean;
};

interface CustomTreeNodeDatum extends TreeNodeDatum {
  id?: string;
  category?: string;
}

export const TreeView = ({ showTree }: TreeViewProps) => {
  const [treeData, setTreeData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [numNotes, setNumNotes] = useState(15);
  const [isUpdateNoteOpen, setIsUpdateNoteOpen] = useState(false);
  const [noteToUpdate, setNoteToUpdate] = useState<any>(null);
  const [newCategory, setNewCategory] = useState<string>('');
  const [treeTranslate, setTreeTranslate] = useState({ x: 400, y: 100 });
  const [zoom, setZoom] = useState(1);
  const { categories } = useActions();
  const { user } = useAuth();

  useEffect(() => {
    fetchTreeData();
  }, [showTree, user?.id, numNotes]);

  const fetchTreeData = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const notes = await NoteService.getMostRecentNotes(user.id, numNotes);

      // Group notes by category
      const categoryMap = notes.reduce((acc: Record<string, any[]>, note: any) => {
        if (!acc[note.category]) acc[note.category] = [];
        acc[note.category].push(note);
        return acc;
      }, {});

      // Format into tree structure
      const treeStructure = {
        name: 'My Notepads',
        children: Object.entries(categoryMap).map(([category, notes]) => ({
          name: category,
          children: notes.map((note: any) => ({
            name: note.content,
            id: note.id,
            category: note.category,
          })),
        })),
      };

      setTreeData(treeStructure);
    } catch (err) {
      console.error('Error fetching notes for tree:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateNote = async (noteId: string) => {
    try {
      await NoteService.updateNote(noteId, newCategory);
      setIsUpdateNoteOpen(false);
      fetchTreeData();
    } catch (err) {
      console.error('Error updating note:', err);
    }
  };

  return (
    <>
      <Row main="spaceBetween" cross="center" gap="md">
        <h1 style={{ margin: 0 }}>My Sparks</h1>
        <CustomDropdown value={numNotes} onChange={(val: number | string) => setNumNotes(val as number)} options={[15, 30, 45, 60, 75]} />
      </Row>
      <ScrollView direction="horizontal">
        <Container width="100%">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div style={{ width: '100%', height: '80vh' }}>
              <TreeContainer>
                <Tree
                  data={treeData}
                  orientation="horizontal"
                  translate={treeTranslate}
                  zoom={zoom}
                  collapsible={false} // disabled
                  zoomable={true}
                  separation={{ siblings: 0.5, nonSiblings: 1.5 }}
                  pathFunc="elbow"
                  depthFactor={250}
                  renderCustomNodeElement={({ nodeDatum }) => {
                    if (!nodeDatum.name && !nodeDatum.children) return null;
                
                    return (
                      <foreignObject width={220} height={60} x={-110} y={-30}>
                        <TreeNodeBox
                          isCategory={!!nodeDatum.children}
                          onClick={() => {
                            const customNode = nodeDatum as CustomTreeNodeDatum;
                            setNoteToUpdate(customNode);
                            if (customNode.category) {
                              setNewCategory(customNode.category);
                            }
                            setIsUpdateNoteOpen(true);
                          }}                          
                        >
                          <TreeNodeContent>{nodeDatum.name}</TreeNodeContent>
                        </TreeNodeBox>
                      </foreignObject>
                    );
                  }}
                  onUpdate={({ translate, zoom }) => {
                    setTreeTranslate(translate);
                    setZoom(zoom);
                  }}                  
                />
              </TreeContainer>
            </div>
          )}
        </Container>
      </ScrollView>
      {isUpdateNoteOpen && (
        <UpdateNoteModal
            isOpen={isUpdateNoteOpen}
            onClose={() => setIsUpdateNoteOpen(false)}
            onSave={() => handleUpdateNote(noteToUpdate!.id!)}
            noteContent={noteToUpdate?.name || ''}   
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            categories={categories}
        />
      )}
    </>
  );
};
