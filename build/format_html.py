# Pretty-prints generated HTML so it is readable in an editor. Needs: pip install beautifulsoup4 (optional; skipped if missing)
INLINE = {'a', 'b', 'strong', 'em', 'span', 'small', 'br', 'svg', 'img', 'input', 'code', 'i', 'path', 'circle'}
VOID = {'meta', 'link', 'br', 'img', 'input'}


def pretty(text):
    try:
        from bs4 import BeautifulSoup, NavigableString, Tag
    except ImportError:
        return text

    def open_tag(el):
        attrs = ''
        for k, v in el.attrs.items():
            v = ' '.join(v) if isinstance(v, list) else v
            attrs += ' ' + k if v == '' else ' %s="%s"' % (k, v.replace('&', '&amp;').replace('"', '&quot;'))
        return '<%s%s>' % (el.name, attrs)

    def leaf(el):
        return all(isinstance(c, NavigableString) or (isinstance(c, Tag) and c.name in INLINE) for c in el.children)

    def render(el, depth, out):
        pad = '  ' * depth
        if el.name in ('script', 'style', 'svg') or el.name in VOID or leaf(el):
            out.append(pad + str(el).strip())
            return
        out.append(pad + open_tag(el))
        for c in el.children:
            if isinstance(c, Tag):
                render(c, depth + 1, out)
            elif c.strip():
                out.append(pad + '  ' + c.output_ready().strip())
        out.append(pad + '</%s>' % el.name)

    soup = BeautifulSoup(text, 'html.parser')
    out = ['<!DOCTYPE html>']
    render(soup.html, 0, out)
    return '\n'.join(out) + '\n'
