const H1 = ({ children }: { children: string }) => {
  return (
    <h1 className="m-auto max-w-3xl text-2xl font-bold text-blue-800 lg:text-5xl">
      {children}
    </h1>
  );
};

export default H1;
