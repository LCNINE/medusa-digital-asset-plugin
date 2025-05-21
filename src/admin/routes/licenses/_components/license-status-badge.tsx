import { Badge } from "@medusajs/ui";

export const LicenseStatusBadge = ({ isExercised }: { isExercised: boolean }) => {
  return isExercised ? <Badge color="green">사용됨</Badge> : <Badge color="blue">미사용</Badge>;
};
