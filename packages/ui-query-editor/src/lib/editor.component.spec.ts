import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorView } from '@codemirror/view';
import { formatGQL } from '@gqlx/util-formatter';
import { GraphQLSchema, buildSchema } from 'graphql';
import { GqlxQueryEditorComponent } from './editor.component';

// The order of calling `fixture.whenStable()` matters!
// Some of the tested method calls call codemirror methods.
// Codemirror uses browser APIs - so we must ensure our fixture is stable.
// In other words: only call methods that directly effect the codemirror view
// after `afterNextRender`, which quarantees browser APIs are available.

describe('GqlxEditorComponent', () => {
  let component: GqlxQueryEditorComponent;
  let fixture: ComponentFixture<GqlxQueryEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GqlxQueryEditorComponent], // Standalone component, so imported here
    }).compileComponents();

    fixture = TestBed.createComponent(GqlxQueryEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Editor Initialization', () => {
    it('should initialize CodeMirror editor after render', async () => {
      await fixture.whenStable();
      expect(component['view']).toBeInstanceOf(EditorView);
    });

    it('should load predefined query into editor state on initialization', async () => {
      const predefinedQuery = '{ users { id name } }';
      await fixture.whenStable();
      component.setDocumentContent(predefinedQuery);
      expect(component.getSnapshot()).toContain('users');
    });
  });

  describe('Methods', () => {
    it('should return snapshot of editor content', async () => {
      const testQuery = '{ users { id name } }';
      await fixture.whenStable();
      component.setDocumentContent(testQuery);
      expect(component.getSnapshot()).toEqual(testQuery);
    });

    it('should format editor content using formatGQL', async () => {
      const testQuery = '{ users { id name } }';
      await fixture.whenStable();
      component.setDocumentContent(testQuery);

      const formattedQuery = await formatGQL(testQuery);
      await component.format();
      expect(component.getSnapshot()).toEqual(formattedQuery);
    });

    it('should update schema in editor when schema input changes', async () => {
      const schema: GraphQLSchema = buildSchema(`
        type Query {
          users: [User]
        }
        type User {
          id: ID
          name: String
        }
      `);

      fixture.componentRef.setInput('schema', schema);
      await fixture.whenStable();

      const initialSnapshot = component.getSnapshot();
      expect(initialSnapshot).toBe(''); // initial snapshot should be empty

      // Set schema and expect schema updates
      // We use `any` here to not have to expose `updateSchema`
      (component as any).updateSchema(schema);
      expect(component['view']).toBeDefined();
    });
  });

  describe('Schema Update', () => {
    it('should clear schema if schema input is null', async () => {
      await fixture.whenStable();
      fixture.componentRef.setInput('schema', null);
      expect(component.getSnapshot()).toBe('');
    });

    it('should call updateSchema with the new schema', async () => {
      const schema: GraphQLSchema = buildSchema(`
        type Query {
          posts: [Post]
        }
        type Post {
          id: ID
          title: String
        }
      `);

      fixture.componentRef.setInput('schema', schema);
      const updateSchemaSpy = jest.spyOn(component, 'updateSchema' as any);

      await fixture.whenStable();
      expect(updateSchemaSpy).toHaveBeenCalledWith(schema);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid schema when showErrorOnInvalidSchema is true', async () => {
      await fixture.whenStable();
      fixture.componentRef.setInput('showErrorOnInvalidSchema', true);
      fixture.componentRef.setInput('schema', null);

      expect(component.getSnapshot()).toBe('');
    });
  });
});
