.PHONY: dev preview

dev: node_modules ## Start development server
	npx vite

preview: build ## Preview production build
	npx vite preview
