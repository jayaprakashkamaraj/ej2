import { IGroupable, SpatialSearch } from './spatial-search';
import { Rect } from '../../primitives/rect';
/**
 * Quad helps to maintain a set of objects that are contained within the particular region
 */
/** @private */
export class Quad {
    /** @private */
    public objects: IGroupable[];
    /** @private */
    public left: number;
    /** @private */
    public top: number;
    /** @private */
    public width: number;
    /** @private */
    public height: number;
    /** @private */
    public first: Quad;
    /** @private */
    public second: Quad;
    /** @private */
    public third: Quad;
    /** @private */
    public fourth: Quad;
    /** @private */
    public parent: Quad;
    private spatialSearch: SpatialSearch;

    /** @private */
    constructor(left: number, top: number, width: number, height: number, spatialSearching: SpatialSearch) {
        this.objects = [];
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        this.spatialSearch = spatialSearching;
    }
    /** @private */
    public findQuads(currentViewPort: Rect, quads: Quad[]): void {
        if (this.first != null && this.first.isIntersect(currentViewPort)) {
            this.first.findQuads(currentViewPort, quads);
        }
        if (this.second != null && this.second.isIntersect(currentViewPort)) {
            this.second.findQuads(currentViewPort, quads);
        }

        if (this.third != null && this.third.isIntersect(currentViewPort)) {
            this.third.findQuads(currentViewPort, quads);
        }

        if (this.fourth != null && this.fourth.isIntersect(currentViewPort)) {
            this.fourth.findQuads(currentViewPort, quads);
        }
        if (this.objects.length > 0) {
            quads.push(this);
        }
    }

    private isIntersect(t: Rect): boolean {
        if (this.left + this.width < t.left || this.top + this.height < t.top || this.left > t.right || this.top > t.bottom) {
            return false;
        }
        return true;
    }
    /** @private */
    public selectQuad(): Quad {
        let target: Quad = null;
        let current: Quad = this;
        let quadSet: QuadSet;
        while (current != null) {
            quadSet = current.getQuad(target);
            current = quadSet.source;
            target = quadSet.target || target;
        }
        return target;
    }

    private getQuad(target: Quad): QuadSet {
        target = null;
        let halfWidth: number = this.width / 2;
        let halfHeight: number = this.height / 2;
        if (halfWidth >= 1000 && halfHeight >= 1000) {
            let xCenter: number = this.left + halfWidth;
            let yCenter: number = this.top + halfHeight;

            if (this.spatialSearch.childRight <= xCenter) {
                if (this.spatialSearch.childBottom <= yCenter) {
                    if (!this.first) {
                        let newQuad: Quad = new Quad(this.left, this.top, halfWidth, halfHeight, this.spatialSearch);
                        newQuad.parent = this;
                        this.first = newQuad;
                    }
                    return { source: this.first };

                }
                if (this.spatialSearch.childTop >= yCenter) {
                    if (!this.third) {
                        let newQuad: Quad = new Quad(this.left, yCenter, halfWidth, halfHeight, this.spatialSearch);
                        newQuad.parent = this;
                        this.third = newQuad;
                    }
                    return { source: this.third };
                }
            } else if (this.spatialSearch.childLeft >= xCenter) {
                if (this.spatialSearch.childBottom <= yCenter) {
                    if (!this.second) {
                        let newQuad: Quad = new Quad(xCenter, this.top, halfWidth, halfHeight, this.spatialSearch);
                        newQuad.parent = this;
                        this.second = newQuad;
                    }
                    return { source: this.second };
                }
                if (this.spatialSearch.childTop >= yCenter) {
                    if (!this.fourth) {
                        let newQuad: Quad = new Quad(xCenter, yCenter, halfWidth, halfHeight, this.spatialSearch);
                        newQuad.parent = this;
                        this.fourth = newQuad;
                    }
                    return { source: this.fourth };
                }
            }
        }
        target = this;
        this.objects.push(this.spatialSearch.childNode);
        return { target: this };
    }
    /** @private */
    public isContained(): boolean {
        if (this.spatialSearch.childLeft >= this.left && this.spatialSearch.childRight <= this.left + this.width &&
            this.spatialSearch.childTop >= this.top && this.spatialSearch.childBottom <= this.top + this.height) {
            return true;
        }
        return false;
    }
    /** @private */
    public addIntoAQuad(node: IGroupable): Quad {
        let quadAddition: QuadAddition = {};
        this.spatialSearch.setCurrentNode(node);
        let quad: Quad = null;
        while (!quadAddition.isAdded) {
            quadAddition = this.spatialSearch.parentQuad.add(quad);
            quad = quadAddition.quad;
        }
        return quad;
    }

    private add(quad: Quad): QuadAddition {
        quad = null;
        if (this.isContained()) {
            quad = this.selectQuad();
            return { isAdded: true, quad: quad };
        } else {
            let newParent: Quad;
            let isempty: boolean = this.objects.length === 0 && !this.first && !this.second && !this.third &&
                !this.fourth;
            let newWidth: number = this.width * 2;
            let newHeight: number = this.height * 2;
            if (this.spatialSearch.childLeft < this.left) {
                if (this.spatialSearch.childTop < this.top) {
                    newParent = new Quad(this.left - this.width, this.top - this.height, newWidth, newHeight, this.spatialSearch);
                    if (!isempty) {
                        newParent.fourth = this;
                    }
                } else {
                    newParent = new Quad(this.left - this.width, this.top, newWidth, newHeight, this.spatialSearch);
                    if (!isempty) {
                        newParent.second = this;
                    }
                }
            } else if (this.spatialSearch.childTop < this.top) {
                newParent = new Quad(this.left, this.top - this.height, newWidth, newHeight, this.spatialSearch);
                if (!isempty) {
                    newParent.third = this;
                }
            } else {
                newParent = new Quad(this.left, this.top, newWidth, newHeight, this.spatialSearch);
                if (!isempty) {
                    newParent.first = this;
                }
            }
            this.parent = newParent;
            this.spatialSearch.parentQuad = newParent;
            return { isAdded: false, quad: quad };
            //newParent.AddIntoaQuad(node);
        }
    }
}
/** @private */
export interface QuadSet {
    target?: Quad;
    source?: Quad;
}
/** @private */
export interface QuadAddition {
    quad?: Quad;
    isAdded?: boolean;
}