export function LogIn() {
    return (
        <div>
            <h1>Log In</h1>
            <form>
                <div>
                    <label>
                        Username:
                        <input type="text" name="username" required />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input type="password" name="password" required />
                    </label>
                </div>
                <button type="submit">Log In</button>
            </form>
        </div>
    );
}