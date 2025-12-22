/**
 * CSS Validation utilities for custom styles
 */

export interface CssValidationResult {
  isValid: boolean;
  errors: CssError[];
  warnings: CssWarning[];
}

export interface CssError {
  line: number;
  message: string;
  snippet: string;
}

export interface CssWarning {
  line: number;
  message: string;
  snippet: string;
}

// Common CSS properties for button-card
const COMMON_CSS_PROPERTIES = [
  'color', 'background', 'background-color', 'background-image', 'background-size',
  'border', 'border-radius', 'border-color', 'border-width', 'border-style',
  'box-shadow', 'text-shadow', 'opacity', 'filter', 'backdrop-filter',
  'transform', 'transition', 'animation',
  'padding', 'margin', 'width', 'height', 'min-width', 'max-width', 'min-height', 'max-height',
  'display', 'flex', 'flex-direction', 'align-items', 'justify-content', 'gap',
  'position', 'top', 'right', 'bottom', 'left', 'z-index',
  'font-size', 'font-weight', 'font-family', 'text-align', 'line-height', 'letter-spacing',
  'overflow', 'cursor', 'pointer-events', 'user-select',
  'fill', 'stroke', 'stroke-width', // SVG properties
  '--card-mod-icon-color', '--ha-card-background', // HA CSS vars
];

// CSS variable pattern
const CSS_VAR_PATTERN = /^--[\w-]+$/;

// Common selectors in button-card custom styles
const COMMON_SELECTORS = [
  'card', 'icon', 'name', 'state', 'label', 'img-cell', 'grid', 'spin',
  '::after', '::before', ':hover', ':active', ':focus',
];

/**
 * Validate CSS/styles string for common errors
 */
export function validateCss(css: string): CssValidationResult {
  const errors: CssError[] = [];
  const warnings: CssWarning[] = [];

  if (!css || css.trim() === '') {
    return { isValid: true, errors: [], warnings: [] };
  }

  const lines = css.split('\n');

  // Track brace balance
  let braceBalance = 0;
  let inComment = false;

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmedLine = line.trim();

    // Skip empty lines
    if (!trimmedLine) return;

    // Track comments
    if (trimmedLine.includes('/*')) {
      inComment = true;
    }
    if (trimmedLine.includes('*/')) {
      inComment = false;
      return; // Skip the rest of comment line
    }
    if (inComment) return;

    // Count braces
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;
    braceBalance += openBraces - closeBraces;

    // Check for unclosed braces at the end
    if (braceBalance < 0) {
      errors.push({
        line: lineNum,
        message: 'Unexpected closing brace',
        snippet: trimmedLine,
      });
      braceBalance = 0; // Reset to prevent cascading errors
    }

    // Check for property declarations (inside rules)
    if (trimmedLine.includes(':') && !trimmedLine.endsWith('{')) {
      // Check if it's a declaration (property: value)
      const colonIndex = trimmedLine.indexOf(':');
      const property = trimmedLine.substring(0, colonIndex).trim();
      const valueWithSemi = trimmedLine.substring(colonIndex + 1).trim();

      // Check for missing semicolon (except for last property before closing brace)
      if (!valueWithSemi.endsWith(';') && !valueWithSemi.endsWith('}')) {
        // Look ahead to see if next non-empty line is a closing brace
        let nextLineIndex = index + 1;
        while (nextLineIndex < lines.length && !lines[nextLineIndex].trim()) {
          nextLineIndex++;
        }
        const nextLine = lines[nextLineIndex]?.trim() || '';
        if (nextLine !== '}' && nextLine.includes(':')) {
          warnings.push({
            line: lineNum,
            message: 'Missing semicolon at end of property',
            snippet: trimmedLine,
          });
        }
      }

      // Check for empty value
      const value = valueWithSemi.replace(/;$/, '').trim();
      if (!value) {
        errors.push({
          line: lineNum,
          message: 'Empty property value',
          snippet: trimmedLine,
        });
      }

      // Check for unbalanced parentheses (common in rgba, url, etc.)
      const openParens = (valueWithSemi.match(/\(/g) || []).length;
      const closeParens = (valueWithSemi.match(/\)/g) || []).length;
      if (openParens !== closeParens) {
        errors.push({
          line: lineNum,
          message: 'Unbalanced parentheses in value',
          snippet: trimmedLine,
        });
      }

      // Check for common typos in CSS functions
      const funcMatch = value.match(/^(\w+)\s*\(/);
      if (funcMatch) {
        const func = funcMatch[1].toLowerCase();
        const typoSuggestions: Record<string, string> = {
          'rgb': 'rgb/rgba',
          'rgbs': 'rgba',
          'linerar': 'linear',
          'radail': 'radial',
          'trasform': 'transform',
          'roate': 'rotate',
          'scle': 'scale',
          'tranlate': 'translate',
        };
        if (typoSuggestions[func]) {
          warnings.push({
            line: lineNum,
            message: `Possible typo: "${func}" - did you mean "${typoSuggestions[func]}"?`,
            snippet: trimmedLine,
          });
        }
      }
    }

    // Check for selector line (ends with {)
    if (trimmedLine.endsWith('{')) {
      const selector = trimmedLine.slice(0, -1).trim();
      
      // Warn about potentially invalid selectors
      if (selector && !selector.match(/^[.#\[\]:\w\s,>+~*-]+$/)) {
        warnings.push({
          line: lineNum,
          message: 'Selector may contain invalid characters',
          snippet: selector,
        });
      }
    }
  });

  // Check for unclosed braces at the end
  if (braceBalance > 0) {
    errors.push({
      line: lines.length,
      message: `Missing ${braceBalance} closing brace${braceBalance > 1 ? 's' : ''}`,
      snippet: '...',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Format validation results as a single string for display
 */
export function formatValidationResults(result: CssValidationResult): string | null {
  if (result.isValid && result.warnings.length === 0) {
    return null;
  }

  const messages: string[] = [];

  result.errors.forEach((err) => {
    messages.push(`Line ${err.line}: ❌ ${err.message}`);
  });

  result.warnings.forEach((warn) => {
    messages.push(`Line ${warn.line}: ⚠️ ${warn.message}`);
  });

  return messages.join('\n');
}

/**
 * Quick check if CSS has any obvious errors (for inline display)
 */
export function hasObviousErrors(css: string): boolean {
  if (!css || css.trim() === '') return false;

  // Quick checks without full parsing
  const openBraces = (css.match(/{/g) || []).length;
  const closeBraces = (css.match(/}/g) || []).length;
  if (openBraces !== closeBraces) return true;

  const openParens = (css.match(/\(/g) || []).length;
  const closeParens = (css.match(/\)/g) || []).length;
  if (openParens !== closeParens) return true;

  return false;
}
