import { TextBarForm, TextInput } from '../SideBar.Styles';
import { PrimaryButton } from '../../../styles/shared/Button.styles';
import { Stack } from '../../../styles/shared/BaseLayout';

export const NoteInput = ({
  text,
  isLoading,
  noteLoading,
  writeInCurrentCategory,
  currentCategory,
  setText,
  handleSubmit,
}: {
  text: string;
  isLoading: boolean;
  noteLoading: boolean;
  writeInCurrentCategory: boolean;
  currentCategory: string;
  setText: (val: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}) => (
  <TextBarForm onSubmit={handleSubmit}>
      <TextInput
        as="textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={writeInCurrentCategory ? 'Writing in ' + currentCategory + '...' : 'Write anything...'}
        disabled={isLoading}
        rows={1}
      />
      <PrimaryButton type="submit" disabled={isLoading || noteLoading}>
          {noteLoading ? 'Capturing...' : 'Capture Spark'}
      </PrimaryButton>
  </TextBarForm>
);
