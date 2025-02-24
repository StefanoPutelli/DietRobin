import { doClientLogin, doNutritionistLogin } from "@/app/actions/authAction";
import logo from "@/asstes/logo.svg";
import google from "@/asstes/google.svg";

export default function Login() {
  return (
    <div className="w-full h-full flex flex-col gap-[2em] justify-center items-center">
      <img src={logo.src} alt="logo" className="h-[150px]" />
      <div className="flex items-center w-[400px] gap-[1em]">
      <img src={google.src} alt="google" className="w-9 h-9 mr-2"/>

        <form action={doNutritionistLogin} className="flex-1">
          <button className="w-full btn btn-outline btn-primary" type="submit" name="action" value="google">
            <span>Nutritionist</span>
          </button>
        </form>
        <div className="h-full border-l-[1px] border-l-base-300 w-0"/>
        <form action={doClientLogin} className="flex-1">
          <button className="w-full btn btn-outline btn-primary" type="submit" name="action" value="google">
            <span>Client</span>
          </button>
        </form>
      </div>

    </div>
  );
};

{/* <form action={doNutritionistLogin}>
            <button className="bg-pink-400 text-white p-1 rounded-md m-1 text-lg" type="submit" name="action" value="google">
              Sign In With Google as Nutritionist
            </button>
          </form>

<form action={doClientLogin}>
<button className="bg-pink-400 text-white p-1 rounded-md m-1 text-lg" type="submit" name="action" value="google">
  Sign In With Google as Client
</button>
</form> */}