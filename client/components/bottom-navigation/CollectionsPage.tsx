import { Accordion } from "../ui";
import CloseButton from "../common/CloseButton"; // Import the client close button

interface Props {
  collections: any;
  onPageClose: () => void; // Accept function from the client wrapper
}

export default function CollectionsPage({ collections, onPageClose }: Props) {

  return (
    <div className="fixed bottom-0 left-0 top-0 z-50 h-full w-full overflow-y-auto bg-white px-5 pt-5">
      <div className="flex justify-between">
        <h2 className="text-xl font-medium">Collections</h2>
        {/* Now using the CloseButton (a client component) */}
        <CloseButton onClick={onPageClose} />
      </div>
      <ul className="mt-5 flex flex-col px-2">
        {collections.map((item: any, index: number) => (
          <li
            key={"collection" + index}
            className="border-b border-solid border-neutral-100 font-medium text-neutral-800"
          >
            {item && (
              <Accordion>
                <Accordion.Header>{item.name}</Accordion.Header>
                <Accordion.Body className="px-2 text-sm">
                  <ul>
                    {item &&
                      item.children.map((gernre: any) => (
                        <li
                          key={"genre" + gernre.id}
                          className="block border-b border-solid border-neutral-100"
                        >
                          <Accordion.Body>
                            <a
                              className="block border-b border-solid border-neutral-100 py-2"
                              href={`/products/all-products?category-id=${gernre.id}&category=${gernre.slug}&search=&page=1`}
                            >
                              <h3>{gernre.name}</h3>
                            </a>
                          </Accordion.Body>
                        </li>
                      ))}
                  </ul>
                </Accordion.Body>
              </Accordion>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
