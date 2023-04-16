export const Details = ({
  children,
  summary,
}: {
  children: React.ReactNode;
  summary: string;
}) => {
  return (
    <details className="w-full cursor-pointer bg-blue-200">
      <Summary>{summary}</Summary>
      <div className="flex flex-col gap-2 bg-blue-200 px-4 py-2">
        {children}
      </div>
    </details>
  );
};

const Summary = ({ children }: { children: React.ReactNode }) => {
  return (
    <summary className="rounded rounded-b-none bg-blue-300 px-4 py-2">
      {children}
    </summary>
  );
};
