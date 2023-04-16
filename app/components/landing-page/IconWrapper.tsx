const IconWrapper = ({ Icon }: { Icon: React.ElementType }) => {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-md border border-gray-200 bg-gray-50 shadow-sm">
      <Icon />
    </div>
  );
};

export default IconWrapper;
