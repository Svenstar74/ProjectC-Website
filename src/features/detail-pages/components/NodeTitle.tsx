import { Tooltip } from "@mui/material";
import { useCenterNode } from "src/features/center-node";

interface Props {
  title: string;
}

function NodeTitle({ title }: Props) {
  const { centerNodeByName } = useCenterNode();

  return (
    <Tooltip
      title={title}
      placement="bottom-start"
      enterDelay={500}
      leaveDelay={200}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [-5, -5],
              },
            },
          ],
        },
      }}
    >
      <p style={styles.title} onClick={() => centerNodeByName(title)}>
        {title}
      </p>
    </Tooltip>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  title: {
    textOverflow: "ellipsis",
    overflow: "hidden",
    // width: "410px",
    whiteSpace: "nowrap",
    margin: 0,
    cursor: "pointer",
    maxWidth: "100%",
  },
};

export default NodeTitle;
