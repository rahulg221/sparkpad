import { TextBarForm, TextInput } from '../_styles';
import { PrimaryButton } from '../../../styles/shared/Button.styles';
import { Stack } from '../../../styles/shared/BaseLayout';

export const NoteInput = ({
  text,
  isLoading,
  noteLoading,
  setText,
  handleSubmit,
}: {
  text: string;
  isLoading: boolean;
  noteLoading: boolean;
  setText: (val: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}) => (
  <TextBarForm onSubmit={handleSubmit}>
      <TextInput
        as="textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Capture the spark before it fades..."
        disabled={isLoading}
        rows={1}
      />
      <PrimaryButton type="submit" disabled={isLoading || noteLoading}>
          {noteLoading ? 'Creating...' : 'Capture Spark'}
      </PrimaryButton>
  </TextBarForm>
);
