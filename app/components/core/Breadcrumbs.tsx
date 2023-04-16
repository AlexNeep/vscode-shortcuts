import { Link } from "@remix-run/react";

const Breadcrumbs = ({
  breadcrumbs,
}: {
  breadcrumbs: { title: string; href: string }[];
}) => (
  <section>
    {breadcrumbs.map(({ title, href }, index) => (
      <span key={title}>
        <Link to={href} className="text-gray-500">
          {title}
        </Link>
        {index < breadcrumbs.length - 1 && (
          <span className="mx-1 text-sm text-gray-500">/</span>
        )}
      </span>
    ))}
  </section>
);

export default Breadcrumbs;
