import * as React from "react";
import { Link, NavLink } from "remix";
import { LATEST_EARTHSTAR_VERSION, LATEST_RS_VERSION } from "~/constants";

type Sitemap = Record<string, string | Record<string, string>>;

const sitemap: Sitemap = {
  // Blog: "/blog",
  "Get started": {
    "How it works": "/get-started/how-it-works",
    "Install the CLI": "/get-started/install-cli",
    "Run a replica server": "/get-started/replica-server",
    "Like a bicycle": "/get-started/like-a-bicycle",
  },
  Tutorials: {
    "Start a webshare": "/tutorials/start-a-webshare",
  },
  Docs: {
    "Playground": "/docs/playground",
    "Developer Tour": "/docs/api-tour",
    "Core API":
      `https://doc.deno.land/https://deno.land/x/earthstar@v${LATEST_EARTHSTAR_VERSION}/mod.ts`,
    "Replica servers": "/docs/replica-servers",
    "Replica server API":
      `https://doc.deno.land/https://deno.land/x/earthstar_replica_server@v${LATEST_RS_VERSION}/mod.ts`,
  },
  Specifications: {
    "es.5 Data Format": "/specs/data-spec-es5",
    "es.4 Data Format": "/specs/data-spec-es4",
  },
  Community: {
    "Contribute code": "/community/contribute",
    Donate: "/community/donate",
    "Code of Conduct": "/community/code-of-conduct",
    "Our backers": "/community/our-backers",
  },
  Links: {
    "Open Collective": "https://opencollective.com/earthstar",
    Discord: "https://discord.gg/EFJnuyKbTv",
    Github: "https://github.com/earthstar-project/earthstar",
  },
};

function LinkOrSection({
  title,
  item,
  collapseDetails,
}: {
  title: string;
  item: string | Record<string, string>;
  collapseDetails: () => void;
}) {
  if (typeof item === "string") {
    return (
      <li className="underline">
        <NavLink
          className="text-es-blue visited:text-purple-900"
          to={item}
          onClick={collapseDetails}
          prefetch="intent"
        >
          {title}
        </NavLink>
      </li>
    );
  }

  return (
    <li className="my-3">
      <span className="font-bold text-gray-700">{title}</span>
      <ul className="pl-2">
        {Object.entries(item).map(([title, url]) => (
          <li key={title}>
            {url.startsWith("http")
              ? (
                <>
                  <a
                    className={"text-es-blue underline visited:text-purple-800 inline-block"}
                    href={url}
                    target={"_blank"}
                  >
                    {title}
                  </a>{" "}
                  ↗
                </>
              )
              : (
                <NavLink
                  className={({ isActive }) =>
                    `text-es-blue underline visited:text-purple-800 ${
                      isActive ? "font-bold" : ""
                    }`}
                  to={url}
                  onClick={collapseDetails}
                  prefetch="intent"
                >
                  {title}
                </NavLink>
              )}
          </li>
        ))}
      </ul>
    </li>
  );
}

export default function Nav() {
  const detailsRef = React.useRef<HTMLDetailsElement | null>(null);

  const collapse = React.useCallback(() => {
    if (detailsRef.current && detailsRef.current.open) {
      detailsRef.current.open = false;
    }
  }, []);

  return (
    <>
      <div className="hidden lg:block overflow-auto self-start sticky top-0">
        <h1 className="text-3xl text-display pl-2 md:pl-4 my-4 ">
          <Link to="/">
            <span className="inline-block text-es-purple border-b-2 border-es-green">
              Earthstar
            </span>
          </Link>
        </h1>
        <nav className="pl-2 md pl-4">
          <ul>
            {Object.entries(sitemap).map(([title, urlOrSection]) => (
              <LinkOrSection
                key={title}
                title={title}
                item={urlOrSection}
                collapseDetails={collapse}
              />
            ))}
          </ul>
        </nav>
      </div>
      <details
        ref={detailsRef}
        className="lg:hidden shadow sticky top-0 bg-white"
      >
        <summary className="text-sm flex items-baseline px-2 md:px-4 pt-1 pb-2 text-gray-600">
          Navigate
          <h1 className="text-2xl text-display text-right flex-grow">
            <Link to="/">
              <span className="inline-block text-es-purple border-b-2 border-es-green">
                Earthstar
              </span>
            </Link>
          </h1>
        </summary>
        <nav className="bg-purple-50 px-2 md:px-4 py-1">
          <ul>
            {Object.entries(sitemap).map(([title, urlOrSection]) => (
              <LinkOrSection
                key={title}
                title={title}
                item={urlOrSection}
                collapseDetails={collapse}
              />
            ))}
          </ul>
        </nav>
      </details>
    </>
  );
}
