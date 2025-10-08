# Security Policy

## SLSA Compliance

Taquito achieves **SLSA Build Level 3**, which provides strong supply chain security guarantees:

- ✅ All releases include cryptographically signed provenance
- ✅ Builds run on GitHub Actions with isolated, ephemeral environments
- ✅ Source code is version controlled with mandatory code review
- ✅ Complete dependency tracking with Software Bill of Materials (SBOM)
- ✅ Artifacts are verifiable from source to distribution

## Verifying Package Authenticity

All Taquito packages published to npm include provenance attestations. You can verify them using two methods:

### Method 1: npm Native Verification (Recommended)

Requires npm 9 or later:

```bash
# Install the package
npm install @taquito/taquito

# Verify all signatures in your project
npm audit signatures
```

**Expected output:**
```
audited X packages in Ys

verified registry signatures
  @taquito/taquito@VERSION (npm)
  @taquito/rpc@VERSION (npm)
  ...
  
All packages have verified signatures from the registry.
```

### Method 2: GitHub SLSA Verification

For advanced users who want to verify the build provenance:

```bash
# 1. Download the package and provenance from GitHub releases
wget https://github.com/ecadlabs/taquito/releases/download/vX.Y.Z/taquito-taquito-X.Y.Z.tgz
wget https://github.com/ecadlabs/taquito/releases/download/vX.Y.Z/taquito-X.Y.Z.intoto.jsonl

# 2. Install slsa-verifier
curl -sSfL https://github.com/slsa-framework/slsa-verifier/releases/download/v2.4.1/slsa-verifier-linux-amd64 -o slsa-verifier
chmod +x slsa-verifier

# 3. Verify the package
./slsa-verifier verify-artifact taquito-taquito-X.Y.Z.tgz \
  --provenance-path taquito-X.Y.Z.intoto.jsonl \
  --source-uri github.com/ecadlabs/taquito \
  --source-tag vX.Y.Z
```

This verifies:
- The artifact was built from the tagged source code
- The build ran on GitHub's infrastructure
- The provenance is signed with Sigstore
- The signature is published in Rekor transparency log

## Software Bill of Materials (SBOM)

Every release includes SBOMs in multiple formats:

- **SPDX JSON**: Industry-standard format for security analysis
- **CycloneDX JSON**: npm-specific format with detailed dependency trees
- **Per-package SBOMs**: Individual bills of materials for each package

Download from releases:
```bash
wget https://github.com/ecadlabs/taquito/releases/download/vX.Y.Z/taquito-sbom.spdx.json
wget https://github.com/ecadlabs/taquito/releases/download/vX.Y.Z/taquito-sbom.cyclonedx.json
```

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 23.x    | :white_check_mark: |
| 22.x    | :white_check_mark: |
| 21.x    | :x:                |
| < 21.0  | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **security@ecadlabs.com**

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the following information:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

This information will help us triage your report more quickly.

## Security Update Process

1. **Report received**: We acknowledge receipt within 48 hours
2. **Initial assessment**: We evaluate severity within 5 business days
3. **Fix development**: We develop and test a fix
4. **Coordinated disclosure**: We coordinate release timing with you
5. **Release**: We publish the fix and security advisory
6. **Credit**: We credit you in the advisory (unless you prefer to remain anonymous)

## Security Best Practices for Users

When using Taquito in your applications:

### 1. Verify Package Integrity

Always verify packages after installation:

```bash
npm audit signatures
```

### 2. Keep Dependencies Updated

Regularly update to the latest version:

```bash
npm update @taquito/taquito
```

### 3. Monitor for Vulnerabilities

Run security audits regularly:

```bash
npm audit
```

### 4. Use Lock Files

Always commit your `package-lock.json`:

```bash
git add package-lock.json
git commit -m "Update dependencies"
```

### 5. Review Dependencies

Check your dependency tree:

```bash
npm list @taquito/taquito
```

## Security Features

### Build Security

- **Isolated builds**: Every build runs in a fresh, isolated environment
- **Reproducible**: Builds are deterministic and reproducible
- **Signed**: All artifacts are cryptographically signed
- **Audited**: Build logs are preserved and auditable

### Dependency Security

- **Locked dependencies**: All dependencies are pinned with exact versions
- **Automated scanning**: Dependencies are scanned for vulnerabilities in CI
- **Dependency review**: All dependency changes are reviewed before merge
- **SBOM generation**: Complete dependency inventories are published

### Source Security

- **Mandatory review**: All code changes require review before merge
- **Branch protection**: Main branch is protected from direct pushes
- **Signed commits**: Contributors are encouraged to sign commits
- **Audit trail**: Complete history of changes is preserved

## Compliance & Standards

Taquito follows these security standards and frameworks:

- [SLSA (Supply-chain Levels for Software Artifacts)](https://slsa.dev/)
- [OpenSSF Best Practices](https://bestpractices.coreinfrastructure.org/en/projects/3204)
- [npm Security Best Practices](https://docs.npmjs.com/security)
- [OWASP Dependency-Check](https://owasp.org/www-project-dependency-check/)

## Security Contacts

- **Email**: security@ecadlabs.com
- **GitHub Security Advisories**: https://github.com/ecadlabs/taquito/security/advisories

## Additional Resources

- [SLSA Framework](https://slsa.dev/)
- [Sigstore Documentation](https://docs.sigstore.dev/)
- [npm Security Docs](https://docs.npmjs.com/security)
- [OpenSSF Scorecard for Taquito](https://scorecard.dev/viewer/?uri=github.com/ecadlabs/taquito)

---

**Last Updated**: October 2025  
**Policy Version**: 1.0
