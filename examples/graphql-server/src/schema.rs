use juniper::{EmptySubscription, FieldResult, RootNode};
use juniper::{GraphQLEnum, GraphQLInputObject, GraphQLObject};

#[derive(GraphQLEnum, Clone, Copy, Debug)]
enum Episode {
    NewHope,
    Empire,
    Jedi,
}

#[derive(GraphQLObject)]
#[graphql(description = "A humanoid creature in the Star Wars universe")]
struct Human {
    id: String,
    name: String,
    appears_in: Vec<Episode>,
    home_planet: String,
}

#[derive(GraphQLInputObject)]
#[graphql(description = "A humanoid creature to create in the Star Wars universe")]
struct NewHuman {
    name: String,
    appears_in: Vec<Episode>,
    home_planet: String,
}

pub struct QueryRoot;

#[juniper::graphql_object]
impl QueryRoot {
    /// Fetch a human by ID
    fn human(&self, id: String) -> FieldResult<Human> {
        if id == "1234" {
            return Ok(Human {
                id: "1234".to_owned(),
                name: "Luke Skywalker".to_owned(),
                appears_in: vec![Episode::NewHope, Episode::Empire, Episode::Jedi],
                home_planet: "Tatooine".to_owned(),
            });
        }

        Err("The human you're looking for is on another planet.".into())
    }

    /// Fetch a list of all humans (because sometimes you just need a crowd)
    fn humans(&self) -> FieldResult<Vec<Human>> {
        Ok(vec![
            Human {
                id: "1234".to_owned(),
                name: "Luke Skywalker".to_owned(),
                appears_in: vec![Episode::NewHope, Episode::Empire, Episode::Jedi],
                home_planet: "Tatooine".to_owned(),
            },
            Human {
                id: "5678".to_owned(),
                name: "Han Solo".to_owned(),
                appears_in: vec![Episode::NewHope, Episode::Empire],
                home_planet: "Corellia".to_owned(),
            },
        ])
    }
}

pub struct MutationRoot;

#[juniper::graphql_object]
impl MutationRoot {
    /// Create a new human
    fn create_human(&self, new_human: NewHuman) -> FieldResult<Human> {
        // Here's where the real magic happens—creating a new human!
        Ok(Human {
            id: format!("{}-new", new_human.name),
            name: new_human.name,
            appears_in: new_human.appears_in,
            home_planet: new_human.home_planet,
        })
    }
}

pub type Schema = RootNode<'static, QueryRoot, MutationRoot, EmptySubscription>;

pub fn create_schema() -> Schema {
    Schema::new(QueryRoot {}, MutationRoot {}, EmptySubscription::new())
}
