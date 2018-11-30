const AuthService = {
    isAuthenticated: false,
    authenticate(cb) {
        this.isAuthenticated = true;
        cb();
    },
    logout(cb) {
        this.isAuthenticated = false;
        cb();
    }
}

export default AuthService;