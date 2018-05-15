function generateCode(x, y, xmin, xmax, ymin, ymax) {
  /*
  * 1001 | 1000 | 1010
  * 0001 | 0000 | 0010
  * 0101 | 0100 | 0110
  * 将平面分为如上九宫格，其中0000代表屏幕
  * 0001、 0010、 0100，、1000分别表示为屏幕左侧、右侧、下侧以及上侧
  * 其它四个编码则表示左上，左下，右上以及右下
  * 最后生成的编码表示点（x,y）相对于屏幕[xmin, xmax, ymin, ymax]的位置
  */
  const inside = 0, left = 1, right = 2, bottom = 4, top = 8
  let code = 0
  if (x < xmin) {
    code |= left
  } else if (x > xmax) {
    code |= right
  } else if (y < ymin) {
    code |= bottom
  } else if (y > ymax) {
    code |= top
  }
  return code
}

/* 判读线段相交，主要通过判断线段端点是否在线段异侧，已一条线段为起点，沿着线段方向，在左手边为逆时针方向，右手边为顺时针方向
* 如果线段A两个端点分别在B线段的两侧，同时B线段的两个端点也在线段A的两侧，则线段A和B相交。
* 主要通过向量叉积进行判读，叉积大于0，改点在向量顺时针方向，小于0，在逆时针方向，等于0，在直线上
* 线段A: a(x, y)、b(x, y) 线段B：c(x, y)、d(x, y)
* u => (c - a) x (b - a)
* v => (d - a) x (b - a)
* w => (a - c) x (d - c)
* z => (b - c) x (d - c)
*/
function crossLine(a, b, c, d) {
  // 判读线段（a, b）和线段（c, d）是否相交
  const u = (c.x - a.x) * (b.y - a.y) - (b.x - a.x) * (c.y - a.y)
  const v = (d.x - a.x) * (b.y - a.y) - (b.x - a.x) * (d.y - a.y)
  const w = (a.x - c.x) * (d.y - c.y) - (d.x - c.x) * (a.y - c.y)
  const z = (b.x - c.x) * (d.y - c.y) - (d.x - c.x) * (b.y - c.y)
  return u * v < 0 && w * z < 0
}
export function lineIntersectPlane (line = { source: { x: 0, y: 0 }, target: { x: 0, y: 0 } }, plane = [0, 1, 0, 1]) {
  const xMin = plane[0]
  const xMax = plane[1]
  const yMin = plane[2]
  const yMax = plane[3]
  const sourceCode = computeCode(line.source.x, line.source.y, xMin, xMax, yMin, yMax)
  const targetCode = computeCode(line.target.x, line.target.y, xMin, xMax, yMin, yMax)
  // 如果sourceCode & targetCode等于0，线段与平面才可能相交
  if (Number(sourceCode & targetCode) === 0) {
    if (sourceCode === 0 || targetCode === 0) {
      return true
    } else {
      const point1 = { x: xMin, y: yMin }
      const point2 = { x: xMin, y: yMax }
      const point3 = { x: xMax, y: yMin }
      const point4 = { x: xMax, y: yMax }
      const point5 = { x: link.source.x, y: link.source.y }
      const point6 = { x: link.target.x, y: link.target.y }
      if (crossLine(point1, point4, point5, point6) || crossLine(point2, point3, point5, point6)) {
        return true
      }
    }
  }
  return false
}