// orval.config.js
const addPrefixTransformer = (prefix) => (content) => {
    if (!content || !content.paths) return content;

    return {
        ...content,
        paths: Object.fromEntries(
            Object.entries(content.paths).map(([path, methods]) => [
                `/${prefix}${path}`,
                methods
            ]))
    };
};

module.exports = {
    auth: {
        input: {
            target: "http://localhost:8000/auth/openapi.json",
            validation: false
        },
        output: {
            target: "./src/api/auth/generated.ts",
            client: "axios",
            mode: "split",
            override: {
                transformer: addPrefixTransformer('auth')
            }
        }
    },
    admin: {
        input: {
            target: "http://localhost:8000/admin/openapi.json",
            validation: false
        },
        output: {
            target: "./src/api/admin/generated.ts",
            client: "axios",
            mode: "split",
            override: {
                transformer: addPrefixTransformer('admin')
            }
        }
    },
    users: {
        input: {
            target: "http://localhost:8000/users/openapi.json",
            validation: false
        },
        output: {
            target: "./src/api/users/generated.ts",
            client: "axios",
            mode: "split",
            override: {
                transformer: addPrefixTransformer('users')
            }
        }
    },
    core: {
        input: {
            target: "http://localhost:8000/openapi.json",
            validation: false
        },
        output: {
            target: "./src/api/core/generated.ts",
            client: "axios",
            mode: "split",
            override: {
                transformer: (content) => {
                    if (!content || !content.paths) return content;

                    return {
                        ...content,
                        paths: Object.fromEntries(
                            Object.entries(content.paths).filter(
                                ([path]) => !path.startsWith("/auth") &&
                                    !path.startsWith("/admin") &&
                                    !path.startsWith("/users")
                            )
                        )
                    };
                }
            }
        }
    }
};