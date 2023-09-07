import { Card, CardContent, Typography } from "@mui/material";

interface Props {
  text: string;
  createdBy: string;
  createdAt: string;
}

function Comment({ text, createdBy, createdAt }: Props) {
  return (
    <Card>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {text}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {createdBy} on {new Date(createdAt).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );


}

export default Comment;
