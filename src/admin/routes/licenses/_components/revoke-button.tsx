import { Button } from "@medusajs/ui";

export const RevokeButton = ({
  isExercised,
  onRevokeClick,
}: {
  isExercised: boolean;
  onRevokeClick: () => void;
}) => {
  return (
    <Button variant="secondary" size="small" disabled={isExercised} onClick={onRevokeClick}>
      취소
    </Button>
  );
};
