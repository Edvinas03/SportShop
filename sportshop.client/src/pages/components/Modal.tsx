import { XMarkIcon } from '@heroicons/react/24/solid';

type ModalProps = {
    visibleModal: boolean;
    title: string;
    children: JSX.Element;
    setVisibleModal: (s: boolean) => void;
};

export function Modal({ visibleModal, title, children, setVisibleModal }: ModalProps) {
    if (!visibleModal) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setVisibleModal(false);
        }
    };

    return (
        <>

            <div
                className="fixed inset-0 z-40 bg-black bg-opacity-50"
                onClick={handleBackdropClick}
            ></div>


            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-xl shadow-xl max-w-lg w-full animate-fadeIn">

                    <div className="flex justify-between items-center border-b px-6 py-4">
                        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                        <button
                            onClick={() => setVisibleModal(false)}
                            className="text-gray-400 hover:text-gray-600 transition"
                            aria-label="Uždaryti"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="px-6 py-4 text-gray-700 text-base">{children}</div>

                    <div className="px-6 py-3 border-t text-right">
                        <button
                            onClick={() => setVisibleModal(false)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                        >
                            Gerai
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
