interface Props {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

function IconToolBarContainer({ children, style }: Props) {
  return (
    <div
      style={{
        background: 'white',
        border: '1px solid lightgray',
        padding: 2,
        borderRadius: 5,
        position: 'absolute',
        right: 0,
        top: 0,
        transition: 'opacity 0.2s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default IconToolBarContainer;
