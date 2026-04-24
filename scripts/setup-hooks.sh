#!/usr/bin/env sh
# Wires up the repo's native Git hook config (see .githooks.config).
# Invoked from package.json's `prepare` script on `npm install`.
#
# Requires Git >= 2.54 (native config-based hooks). On older Git the
# [hook "..."] sections are silently ignored, so we warn loudly and
# leave the user's config untouched rather than breaking `npm ci`.

set -eu

# No .git directory? Published tarball or shallow/detached deploy checkout.
# Nothing to wire up; exit clean.
if ! git rev-parse --git-dir >/dev/null 2>&1; then
	exit 0
fi

required_major=2
required_minor=54
include_target="../.githooks.config"
husky_hooks_path=".husky/_"

version=$(git --version | awk '{print $3}')
major=$(echo "$version" | cut -d. -f1)
minor=$(echo "$version" | cut -d. -f2)

if [ "$major" -lt "$required_major" ] || { [ "$major" -eq "$required_major" ] && [ "$minor" -lt "$required_minor" ]; }; then
	echo "warning: git $version is too old for native config-based hooks (need >= ${required_major}.${required_minor})." >&2
	echo "         skipping hook setup. upgrade git to enable pre-commit hooks." >&2
	exit 0
fi

# Only remove core.hooksPath if it's the old husky pointer. Leave anything
# else alone - the contributor may have set it intentionally.
existing_hooks_path=$(git config --local --get core.hooksPath || true)
if [ "$existing_hooks_path" = "$husky_hooks_path" ]; then
	git config --local --unset core.hooksPath
fi

# include.path is multi-valued; don't append a duplicate on repeat runs.
if ! git config --local --get-all include.path 2>/dev/null | grep -Fxq "$include_target"; then
	git config --local --add include.path "$include_target"
fi
