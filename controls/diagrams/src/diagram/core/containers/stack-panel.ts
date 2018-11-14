import { DiagramElement as Element } from '../elements/diagram-element';
import { Container } from './container';
import { Orientation } from '../../enum/enum';
import { Size } from '../../primitives/size';
import { PointModel as Point } from '../../primitives/point-model';
import { rotateSize } from '../../utility/base-util';

/**
 * StackPanel module is used to arrange its children in a line
 */
export class StackPanel extends Container {
    /**
     * Gets/Sets the orientation of the stack panel
     */
    public orientation: Orientation = 'Vertical';

    /**
     * Not applicable for canvas
     * @private 
     */
    public measureChildren: boolean = undefined;
    /**
     * Measures the minimum space that the panel needs
     * @param availableSize 
     */
    public measure(availableSize: Size): Size {
        let updateSize: Function = this.orientation === 'Horizontal' ? this.updateHorizontalStack : this.updateVerticalStack;
        this.desiredSize = this.measureStackPanel(availableSize, updateSize);
        return this.desiredSize;
    }

    /**
     * Arranges the child elements of the stack panel
     * @param desiredSize 
     */
    public arrange(desiredSize: Size): Size {
        let updateSize: Function = this.orientation === 'Horizontal' ? this.arrangeHorizontalStack : this.arrangeVerticalStack;
        this.actualSize = this.arrangeStackPanel(desiredSize, updateSize);
        this.updateBounds();
        return this.actualSize;
    }

    /**
     * Measures the minimum space that the panel needs
     * @param availableSize 
     */
    private measureStackPanel(availableSize: Size, updateSize: Function): Size {
        let desired: Size = undefined;
        if (this.children !== undefined && this.children.length > 0) {
            for (let child of this.children) {
                child.parentTransform = this.rotateAngle + this.parentTransform;
                //Measure children
                child.measure(availableSize);
                let childSize: Size = child.desiredSize.clone();
                //Consider Child's margin
                this.applyChildMargin(child, childSize);
                //Consider children's rotation
                if (child.rotateAngle !== 0) {
                    childSize = rotateSize(childSize, child.rotateAngle);
                }
                //Measure stack panel
                if (desired === undefined) {
                    desired = childSize;
                } else {
                    updateSize(childSize, desired);
                }
            }
        }
        desired = super.validateDesiredSize(desired, availableSize);
        this.stretchChildren(desired);
        //Considering padding values
        this.applyPadding(desired);
        return desired;
    }

    private arrangeStackPanel(desiredSize: Size, updatePosition: Function): Size {
        if (this.children !== undefined && this.children.length > 0) {
            let x: number;
            let y: number;
            x = this.offsetX - desiredSize.width * this.pivot.x + this.padding.left;
            y = this.offsetY - desiredSize.height * this.pivot.y + this.padding.top;
            for (let child of this.children) {
                let childSize: Size = child.desiredSize.clone();
                let rotatedSize: Size = childSize;

                if (this.orientation === 'Vertical') {
                    y += child.margin.top;
                } else {
                    x += child.margin.left;
                }

                if (child.rotateAngle !== 0) {
                    rotatedSize = rotateSize(childSize, child.rotateAngle);
                }

                let center: Point = updatePosition(x, y, child, this, desiredSize, rotatedSize);
                super.findChildOffsetFromCenter(child, center);
                child.arrange(childSize);

                if (this.orientation === 'Vertical') {
                    y += rotatedSize.height + child.margin.bottom;
                } else {
                    x += rotatedSize.width + child.margin.right;
                }
            }
        }
        return desiredSize;
    }

    private updateHorizontalStack(child: Size, parent: Size): void {
        parent.height = Math.max(child.height, parent.height);
        parent.width += child.width;
    }

    private updateVerticalStack(child: Size, parent: Size): void {
        parent.width = Math.max(child.width, parent.width);
        parent.height += child.height;
    }

    private arrangeHorizontalStack(x: number, y: number, child: Element, parent: StackPanel, parenBounds: Size, childBounds: Size): Point {
        let centerY: number = 0;

        if (child.verticalAlignment === 'Top') {
            centerY = y + child.margin.top + childBounds.height / 2;
        } else if (child.verticalAlignment === 'Bottom') {
            let parentBottom: number = parent.offsetY + parenBounds.height * (1 - parent.pivot.y);
            centerY = parentBottom - parent.padding.bottom - child.margin.bottom - childBounds.height / 2;
        } else {
            centerY = parent.offsetY - parenBounds.height * parent.pivot.y + parenBounds.height / 2;
        }

        return { x: x + childBounds.width / 2, y: centerY };
    }

    private arrangeVerticalStack(x: number, y: number, child: Element, parent: StackPanel, parentSize: Size, childSize: Size): Point {

        let centerX: number = 0;
        if (child.horizontalAlignment === 'Left') {
            centerX = x + child.margin.left + childSize.width / 2;
        } else if (child.horizontalAlignment === 'Right') {
            let parentRight: number = parent.offsetX + parentSize.width * (1 - parent.pivot.x);
            centerX = parentRight - parent.padding.right - child.margin.right - childSize.width / 2;
        } else {
            centerX = parent.offsetX - parentSize.width * parent.pivot.x + parentSize.width / 2;
        }
        return { x: centerX, y: y + childSize.height / 2 };
    }

    protected stretchChildren(size: Size): void {
        if (this.children !== undefined && this.children.length > 0) {
            for (let child of this.children) {
                if (this.orientation === 'Vertical') {
                    if (child.horizontalAlignment === 'Stretch') {
                        child.desiredSize.width = size.width;
                    }
                } else {
                    if (child.verticalAlignment === 'Stretch') {
                        child.desiredSize.height = size.height;
                    }
                }
            }
        }
    }

    private applyChildMargin(child: Element, size: Size): void {
        size.height += child.margin.top + child.margin.bottom;
        size.width += child.margin.left + child.margin.right;
    }
}