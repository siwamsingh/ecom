"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Plus, Minus, ShoppingCart, AlertCircle } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import MainLayout from "../MainLayout";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CartItem {
  cart_id: number;
  quantity: number;
  product_id: number;
  product_name: string;
  price: string;
  status: string;
  image_url: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkoutUrl,setCheckoutUrl] = useState<string>("/");
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post<{ data: { cart: CartItem[] } }>(
          `/api/cart/get-cart`,
          {}
        );
        setCartItems(response.data.data.cart);
      } catch (error: any) {
        
        if (error?.response?.status === 577 || error?.response?.status === 477) {
          toast.error("Login to continue.");
          setTimeout(() => {
            router.push("/auth/login");
          }, 3000);
          return;
        }
        setError("Failed to load your cart. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  useEffect(()=>{
    const temp = cartItems.map(item => `${item.product_id}:${item.quantity}`).join(",");
    setCheckoutUrl(temp);
  },[cartItems])

  const deleteItem = async (product_id: number) => {
    setConfirmDelete(product_id);
  };

  const confirmDeletion = async () => {
    if (!confirmDelete) return;
    try {
      await axios.post(`/api/cart/delete-cart`, {
        product_id: confirmDelete,
      });

      setCartItems((prev) =>
        prev.filter((item) => item.product_id !== confirmDelete)
      );
    } catch{
      setError("Failed to remove item. Please try again.");
    } finally {
      setConfirmDelete(null);
    }
  };

  const updateQuantity = async (product_id: number, newQuantity: number) => {
    if (newQuantity < 0) return;
    if (newQuantity > 5) return; // Enforce maximum quantity of 5

    if (newQuantity === 0) {
      setConfirmDelete(product_id);
    } else {
      try {
         await axios.post<{ data: { cart: CartItem[] } }>(
          `/api/cart/update-cart`,
          {
            product_id,
            quantity: newQuantity,
          }
        );

        setCartItems((prev) =>
          prev.map((item) =>
            item.product_id === product_id
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      } catch {
        setError("Failed to update quantity. Please try again.");
      }
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
            <div className="flex items-center text-gray-600">
              <ShoppingCart className="mr-2 h-5 w-5" />
              <span>{cartItems.length} items</span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <div className="mb-4 flex justify-center">
                <ShoppingCart className="h-16 w-16 text-gray-400" />
              </div>
              <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
              <a
                href="/products/all-products"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </a>
            </div>
          ) : (
            <>
              <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
                {/* Table Header - Hide on mobile */}
                <div className="border-b border-gray-200 px-6 py-4 bg-gray-50 hidden md:block">
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                    <div className="col-span-7">Product</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.cart_id} className="p-4 md:p-6">
                      {/* Mobile layout - stack vertically */}
                      <div className="md:hidden mb-4">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="h-16 w-16  bg-gray-100 rounded-md flex-shrink-0">
                            {item.image_url ? (
                              <Image
                                src={item.image_url}
                                alt={item.product_name}
                                width={100}
                                height={100}
                                loading="lazy"
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-400">
                                <ShoppingCart className="h-8 w-8" />
                              </div>
                            )}
                          </div>
                          <div>
                            <a  href={`/product?product_id=${item.product_id}&product_name=${item.product_name}`}  className="font-medium text-gray-900">
                              {item.product_name}
                            </a>
                            <p
                              className={`text-sm ${
                                item.status === "active"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {item.status}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 items-center">
                          <div className="text-left">
                            <div className="text-sm text-gray-500">Price:</div>
                            <div className="font-medium">
                              ₹{Number(item.price).toFixed(2)}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-gray-500 mb-1">
                              Quantity:
                            </div>
                            <div className="flex items-center">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product_id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1}
                                className={`w-7 h-7 flex items-center justify-center rounded-full ${
                                  item.quantity <= 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="mx-2 w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product_id,
                                    item.quantity + 1
                                  )
                                }
                                disabled={item.quantity >= 5}
                                className={`w-7 h-7 flex items-center justify-center rounded-full ${
                                  item.quantity >= 5
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            {item.quantity >= 5 && (
                              <p className="text-xs text-orange-500 mt-1">
                                Max
                              </p>
                            )}
                          </div>

                          <div className="flex justify-end">
                            <button
                              onClick={() => deleteItem(item.product_id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Desktop layout - grid */}
                      <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:items-center">
                        <div className="col-span-7 flex items-center space-x-4">
                          <div className="h-20 w-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                            {item.image_url ? (
                              <Image
                                src={item.image_url}
                                alt={item.product_name}
                                loading="lazy"
                                width={100}
                                height={100}
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-400">
                                <ShoppingCart className="h-8 w-8" />
                              </div>
                            )}
                          </div>
                          <div>
                            <a href={`/product?product_id=${item.product_id}&product_name=${item.product_name}`} className="font-medium text-gray-900 hover:underline">
                              {item.product_name}
                            </a>
                            <p
                              className={`text-sm ${
                                item.status === "active"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {item.status}
                            </p>
                          </div>
                        </div>

                        <div className="col-span-2 text-center font-medium">
                          ₹{Number(item.price).toFixed(2)}
                        </div>

                        <div className="col-span-2">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product_id,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity <= 1}
                              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                                item.quantity <= 1
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              }`}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="mx-3 w-5 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product_id,
                                  item.quantity + 1
                                )
                              }
                              disabled={item.quantity >= 5}
                              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                                item.quantity >= 5
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              }`}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          {item.quantity >= 5 && (
                            <p className="text-xs text-center text-orange-500 mt-1">
                              Max quantity
                            </p>
                          )}
                        </div>

                        <div className="col-span-1 flex items-center justify-end">
                          <button
                            onClick={() => deleteItem(item.product_id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white  rounded-lg p-6">
                <div className="flex justify-between mb-6">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-lg font-bold">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col space-y-2">
                  <a href={`/order/confirm?products=${checkoutUrl}`} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium text-center hover:bg-blue-700 transition-colors">
                    Proceed to Checkout
                  </a>
                  <a
                    href="/products/all-products?category_id=&category=&search=&page=1"
                    className="w-full text-center py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </a>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Confirmation Dialog */}
        <Transition appear show={!!confirmDelete} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50"
            onClose={() => setConfirmDelete(null)}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/30" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <div className="flex items-center justify-center mb-4 text-red-500">
                      <AlertCircle className="h-12 w-12" />
                    </div>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 text-center"
                    >
                      Remove Item
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 text-center">
                        Are you sure you want to remove this item from your
                        cart?
                      </p>
                    </div>

                    <div className="mt-6 flex justify-center space-x-3">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => setConfirmDelete(null)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                        onClick={confirmDeletion}
                      >
                        Remove
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </MainLayout>
  );
}
