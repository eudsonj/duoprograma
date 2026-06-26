import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, Flame, MessageSquare, ThumbsUp, PlusCircle, Globe, Filter, Check } from "lucide-react";
import { ForumPost, FriendActivity, AppLanguage } from "../types";
import { MOCK_FORUM_POSTS, MOCK_FRIENDS_ACTIVITIES, APP_TRANSLATIONS } from "../data";
import { playSound } from "../utils/audio";

interface CommunityForumProps {
  language: AppLanguage;
}

export const CommunityForum: React.FC<CommunityForumProps> = ({ language }) => {
  const t = APP_TRANSLATIONS[language];

  const [posts, setPosts] = useState<ForumPost[]>(MOCK_FORUM_POSTS);
  const [friendsFeed, setFriendsFeed] = useState<FriendActivity[]>(MOCK_FRIENDS_ACTIVITIES);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const [showAddPost, setShowAddPost] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<"JS" | "Python" | "SQL" | "General" | "HTML/CSS">("General");

  // Comment submission state
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const handleUpvote = (postId: string) => {
    playSound("click");
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return { ...post, upvotes: post.upvotes + 1 };
        }
        return post;
      })
    );
  };

  const handleCongratulateFriend = (activityId: string) => {
    playSound("coin");
    setFriendsFeed(
      friendsFeed.map((f) => {
        if (f.id === activityId) {
          return { ...f, congratulated: true };
        }
        return f;
      })
    );
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    playSound("level-up");

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      author: "Você (Estudante)",
      avatar: "🤖",
      title: newTitle,
      content: newContent,
      category: newCategory,
      upvotes: 1,
      commentsCount: 0,
      createdAt: "Agora mesmo",
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setNewTitle("");
    setNewContent("");
    setShowAddPost(false);
  };

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;
    playSound("click");

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: [
              ...post.comments,
              {
                id: `c-${Date.now()}`,
                author: "Você (Estudante)",
                avatar: "🤖",
                content: commentText,
                createdAt: "Agora mesmo",
              },
            ],
          };
        }
        return post;
      })
    );
    setCommentText("");
  };

  const categories = ["All", "JS", "Python", "SQL", "HTML/CSS", "General"];
  const filteredPosts = activeCategory === "All" ? posts : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6 pb-20">
      {/* Community Header Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 text-emerald-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-white">{t.communityForum}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Compartilhe dúvidas, aprenda com colegas e ganhe motivação diária!
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playSound("click");
            setShowAddPost(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-emerald-500/10"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.postQuestion}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forum Posts Main List (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-1.5 items-center select-none bg-slate-950 p-1.5 rounded-xl border border-slate-800/80">
            <Filter className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  playSound("click");
                  setActiveCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  activeCategory === cat
                    ? "bg-emerald-500 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* New Post Form Overlay Modal */}
          <AnimatePresence>
            {showAddPost && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative"
                >
                  <h3 className="font-extrabold text-lg text-white mb-4">Nova Pergunta</h3>
                  <form onSubmit={handleSubmitPost} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">{t.newPostTitle}</label>
                      <input
                        required
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Ex: Qual a diferença entre const e let?"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-400 block mb-1">Categoria</label>
                        <select
                          value={newCategory}
                          onChange={(e: any) => setNewCategory(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="JS">JavaScript</option>
                          <option value="Python">Python</option>
                          <option value="SQL">SQL</option>
                          <option value="HTML/CSS">HTML & CSS</option>
                          <option value="General">Geral / Dicas</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Descrição</label>
                      <textarea
                        required
                        rows={4}
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        placeholder={t.newPostContent}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                      />
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          playSound("click");
                          setShowAddPost(false);
                        }}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black cursor-pointer shadow-lg shadow-emerald-500/10"
                      >
                        {t.submit}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Posts Feed */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-10 bg-slate-950 rounded-2xl border border-slate-800/60 p-4 text-slate-500 italic text-sm">
              Nenhuma pergunta encontrada para esta categoria. Seja o primeiro a postar!
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-3.5 hover:border-slate-800 transition-all"
              >
                {/* Post Author Info */}
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{post.avatar}</span>
                    <span className="font-bold text-slate-200">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-900 border border-slate-800 text-[10px] text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase select-none">
                      {post.category}
                    </span>
                    <span>•</span>
                    <span>{post.createdAt}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="select-text">
                  <h3 className="font-extrabold text-base text-white hover:text-emerald-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>
                </div>

                {/* Footer Toolbar: Upvote & Comment counts */}
                <div className="flex items-center gap-4 pt-1 border-t border-slate-900/60 text-xs text-slate-400 select-none">
                  <button
                    onClick={() => handleUpvote(post.id)}
                    className="flex items-center gap-1.5 hover:text-emerald-400 cursor-pointer transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{post.upvotes} {t.upvotes}</span>
                  </button>

                  <button
                    onClick={() => {
                      playSound("click");
                      setActivePostId(activePostId === post.id ? null : post.id);
                    }}
                    className={`flex items-center gap-1.5 hover:text-emerald-400 cursor-pointer transition-colors ${
                      activePostId === post.id ? "text-emerald-400 font-bold" : ""
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.commentsCount} {t.comments}</span>
                  </button>
                </div>

                {/* Comments Expandable Panel */}
                <AnimatePresence>
                  {activePostId === post.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-slate-900/40 p-3 rounded-xl border border-slate-900 mt-2 space-y-3.5"
                    >
                      {/* Comments Feed */}
                      <div className="space-y-3">
                        {post.comments.length === 0 ? (
                          <p className="text-[11px] text-slate-500 italic">Sem comentários ainda. Deixe sua contribuição!</p>
                        ) : (
                          post.comments.map((comment) => (
                            <div key={comment.id} className="border-b border-slate-900/50 pb-2.5 last:border-0 last:pb-0 select-text">
                              <div className="flex justify-between text-[11px] text-slate-400">
                                <span className="font-bold text-slate-200">{comment.avatar} {comment.author}</span>
                                <span>{comment.createdAt}</span>
                              </div>
                              <p className="text-[11px] text-slate-300 mt-1 font-normal leading-relaxed">
                                {comment.content}
                              </p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Comment Input */}
                      <div className="flex gap-2 pt-2 border-t border-slate-900/80">
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Adicione um comentário..."
                          className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs cursor-pointer"
                        >
                          Enviar
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>

        {/* Friends Activity Sidebar (1/3 width) */}
        <div className="space-y-4">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 select-none">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-emerald-400" />
              {t.friendsActivity}
            </h3>

            <div className="space-y-3.5">
              {friendsFeed.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/40 space-y-2 text-xs"
                >
                  <div className="flex justify-between text-slate-400 items-start">
                    <div className="flex items-center gap-1.5 font-bold text-slate-200">
                      <span>{activity.avatar}</span>
                      <span className="truncate max-w-[80px]">{activity.name}</span>
                    </div>
                    <span className="text-[10px]">{activity.time}</span>
                  </div>

                  <p className="text-slate-300 text-[11px] leading-relaxed select-text">
                    {activity.achievement[language]}
                  </p>

                  <div className="flex justify-end pt-1">
                    {activity.congratulated ? (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> {t.congratulated}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleCongratulateFriend(activity.id)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 hover:text-white border border-slate-700/50 rounded-md cursor-pointer transition-all flex items-center gap-1"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{t.congratulate}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
