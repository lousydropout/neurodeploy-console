import { A } from "@solidjs/router";
import { For, Show } from "solid-js";

const ChevronRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="w-4 h-4"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M8.25 4.5l7.5 7.5-7.5 7.5"
    />
  </svg>
);

export const Breadcrumbs = ({ pages }) => {
  const lastIndex = pages.length - 2;

  return (
    <nav class="bg-transparent text-white mb-8" aria-label="Breadcrumb">
      <ol class="list-none flex">
        <li class="mr-2">
          <A
            href={`${pages[0].link}`}
            class="text-violet-500 hover:text-violet-200"
          >
            {pages[0].name}
          </A>
        </li>
        <For each={pages.slice(1)}>
          {(page, k) => (
            <li class="flex items-center space-x-2 mr-2">
              <ChevronRight />
              <Show
                when={k() !== lastIndex}
                fallback={<span class="text-gray-400">{page.name}</span>}
              >
                <A
                  href={`${page.link}`}
                  class="text-violet-500 hover:text-violet-200"
                >
                  {page.name}
                </A>
              </Show>
            </li>
          )}
        </For>
      </ol>
    </nav>
  );
};
