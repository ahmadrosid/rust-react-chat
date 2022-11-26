import { useState } from "react";

async function createAccount({ username, phone }) {
    try {
        const url = "http://localhost:8080/users/create";
        let result = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, phone })
        });
        return result.json();
    } catch (e) {
        return Promise.reject(e);
    }
}

async function signIn({ phone }) {
    try {
        const url = "http://localhost:8080/users/phone/" + phone;
        let result = await fetch(url);
        return result.json();
    } catch (e) {
        return Promise.reject(e);
    }
}

export default function Login({ show, setAuth }) {
    const [isShowSigIn, setShowSignIn] = useState(false);

    const showSignIn = () => {
        setShowSignIn(prev => !prev)
    }

    const FormCreateUsername = ({ setAuth }) => {
        const onCreateUsername = async (e) => {
            e.preventDefault();
            let username = e.target.username.value;
            let phone = e.target.phone.value;
            if (username === "" || phone === "") {
                return;
            }

            let res = await createAccount({ username, phone });
            if (res === null) {
                alert("Failed to create account");
                return;
            }

            setAuth(res)
        }

        return (
            <form action="" className="mt-4 space-y-2" onSubmit={onCreateUsername}>
                <div>
                    <label className="text-sm font-light">Username</label>
                    <input required type="text" name="username" placeholder="Jhon Doe"
                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                </div>

                <div>
                    <label className="text-sm font-light">Phone</label>
                    <input required type="text" name="phone" placeholder="+1111..."
                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                </div>

                <div className="flex items-baseline justify-between">
                    <button type="submit"
                        className="px-6 py-2 mt-4 text-white bg-violet-600 rounded-lg hover:bg-violet-700 w-full">Submit</button>
                </div>

                <div className="pt-2 space-y-2 text-center">
                    <p className="text-base text-gray-700">Already have a username? <button onClick={showSignIn} className="text-violet-700 font-light">Sign In</button></p>
                </div>
            </form>
        )
    }

    const FormSignIn = ({ setAuth }) => {
        const onSignIn = async (e) => {
            e.preventDefault();
            let phone = e.target.phone.value;
            if (phone === "") {
                return;
            }

            let res = await signIn({ phone });
            if (res === null) {
                alert("Failed to create account");
                return;
            }

            if (!res.id) {
                alert(`Phone number not found ${phone}`);
                return;
            }

            setAuth(res)
        }

        return (
            <form action="" className="mt-4 space-y-2" onSubmit={onSignIn}>
                <div>
                    <label className="text-sm font-light">Phone</label>
                    <input required type="text" name="phone" placeholder="+1111..."
                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                </div>

                <div className="flex items-baseline justify-between">
                    <button type="submit"
                        className="px-6 py-2 mt-4 text-white bg-violet-600 rounded-lg hover:bg-violet-700 w-full">Submit</button>
                </div>

                <div className="pt-2 space-y-2 text-center">
                    <p className="text-base text-gray-700">Don't have username? <button onClick={showSignIn} className="text-violet-700 font-light">Create</button></p>
                </div>
            </form>
        )
    }

    return (
        <div className={`${show ? '' : 'hidden'} bg-gradient-to-b from-orange-400 to-rose-400`}>
            <div className="flex items-center justify-center min-h-screen">
                <div className="px-8 py-6 mt-4 text-left bg-white  max-w-[400px] w-full rounded-xl shadow-lg">
                    <h3 className="text-xl text-slate-800 font-semibold">{isShowSigIn ? 'Log in with your phone.' : 'Create your account.'}</h3>
                    {isShowSigIn ? <FormSignIn setAuth={setAuth} /> : <FormCreateUsername setAuth={setAuth} />}
                </div>
            </div>
        </div>
    )
}
